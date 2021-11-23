import { NextApiResponse } from "next";
import { AdoAuthApiResponse, AdoAuthApiResponseTypes } from "./types";

export function respond(
  res: NextApiResponse,
  response: AdoAuthApiResponse
): void {
  switch (response.code) {
    case AdoAuthApiResponseTypes.ADO_REQUEST_ERROR:
    case AdoAuthApiResponseTypes.MISSING_CODE:
    case AdoAuthApiResponseTypes.MISSING_SECRET:
    case AdoAuthApiResponseTypes.NO_RESULT:
    case AdoAuthApiResponseTypes.NO_TOKENS:
      return res.status(500).json(response);
    case AdoAuthApiResponseTypes.SUCCESS:
      return res.status(200).json(response);
  }
}
