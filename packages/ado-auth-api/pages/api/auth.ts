// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { authResultHandler } from '../../lib/authResultHandler'
import { SERVER_PORT } from '../../lib/constants'
import { respond } from '../../lib/respond'
import { AdoAuthApiResponseTypes } from '../../lib/types'

const config: Record<string, string | number> = {
  port: SERVER_PORT,
}

export default async function authenticate(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const authCode = req.query.code
  const state = req.query.state

  if (typeof state === 'string') {
    const decodedState = JSON.parse(decodeURIComponent(state))
    for (const [key, value] of Object.entries(decodedState)) {
      config[key] = value as string
    }
  }

  if (typeof authCode !== 'string') {
    return res.status(200).json({
      code: 'MISSING_CODE',
      message: 'No code is passed',
    })
  }

  if (!process.env.clientSecret) {
    return res.status(200).json({
      code: 'MISSING_SECRET',
      message: 'No secret is detected in env',
    })
  }

  try {
    const body = `client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer&client_assertion=${encodeURIComponent(
      process.env.clientSecret
    )}&grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${encodeURIComponent(
      authCode
    )}&redirect_uri=https://ado-auth.vercel.app/api/auth`

    const result = await fetch(
      'https://app.vssps.visualstudio.com/oauth2/token',
      {
        body,
        method: 'POST',
        headers: new Headers([
          ['Content-Type', 'application/x-www-form-urlencoded'],
        ]),
      }
    ).then((res) => res.json())

    authResultHandler(res, result, config.port)
  } catch (error) {
    const err = error as Error
    return respond(res, {
      code: AdoAuthApiResponseTypes.ADO_REQUEST_ERROR,
      error: 'Some server error while making token request',
      body: {
        message: err.message,
        stack: err.stack,
      },
    })
  }
}
