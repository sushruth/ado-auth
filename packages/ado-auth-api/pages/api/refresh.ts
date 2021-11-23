// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fetch, { Headers } from "node-fetch";
import { respond } from "../../lib/respond";
import { AdoAuthApiResponseTypes, Token } from "../../lib/types";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const refreshToken = req.query.token || req.body.token;

  if (!refreshToken || typeof refreshToken !== "string") {
    return res.status(200).json({
      code: "MISSING_CODE",
      message: "No code is passed",
    });
  }

  if (!process.env.clientSecret) {
    return res.status(200).json({
      code: "MISSING_SECRET",
      message: "No secret is detected in env",
    });
  }

  try {
    const body = `client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer&client_assertion=${encodeURIComponent(
      process.env.clientSecret
    )}&grant_type=refresh_token&assertion=${encodeURIComponent(
      refreshToken
    )}&redirect_uri=${encodeURIComponent(
      "https://ado-auth.vercel.app/api/auth"
    )}`;

    const result = await fetch(
      "https://app.vssps.visualstudio.com/oauth2/token",
      {
        body,
        method: "POST",
        headers: new Headers([
          ["Content-Type", "application/x-www-form-urlencoded"],
        ]),
      }
    ).then((res) => res.json()) as Token;

    if (!result) {
      return respond(res, {
        code: AdoAuthApiResponseTypes.NO_RESULT,
        error: "No result was received from the auth endpoint",
      });
    } else if (result.access_token && result.refresh_token) {
      return respond(res, {
        code: AdoAuthApiResponseTypes.SUCCESS,
        body: result,
      });
    }
  } catch (error) {
    const err = error as Error;
    return respond(res, {
      code: AdoAuthApiResponseTypes.ADO_REQUEST_ERROR,
      error: "Some server error while making token request",
      body: {
        message: err.message,
        stack: err.stack,
      },
    });
  }
};
