import fs from 'fs'
import { Token } from './types'

export function writeAdoRc(rcPath: string, response: Token) {
  const expires_in_seconds = Number(response.expires_in)

  if (isNaN(expires_in_seconds)) {
    throw Error(
      'Auth token has invalid expires_in property. Expected a number.'
    )
  }

  const expires_on = new Date(
    Date.now() + expires_in_seconds * 1000
  ).toISOString()

  fs.writeFileSync(
    rcPath,
    JSON.stringify(
      {
        ...response,
        expires_on,
      },
      null,
      '  '
    ),
    'utf8'
  )
}
