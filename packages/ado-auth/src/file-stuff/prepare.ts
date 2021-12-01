import fs from 'fs'
import { TokenStore } from '../lib/types'
import { PrepareReturn, PrepareTypes } from './prepare.types'

export function prepare(rcPath: string): PrepareReturn {
  if (fs.existsSync(rcPath)) {
    // handle when file exists
    const file = fs.readFileSync(rcPath, 'utf-8')
    try {
      const data: TokenStore = JSON.parse(file)
      const isGoingToExpireInFiveMinutes =
        new Date(data.expires_on) < new Date(Date.now() - 5 * 60 * 1000)

      if (isGoingToExpireInFiveMinutes) {
        // expires in less than 5 minutes
        return {
          type: PrepareTypes.refetch,
          data,
        }
      } else {
        // Nothing to do
        return {
          type: PrepareTypes.noop,
          data,
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.warn(error.message)
      }
    }
  }
  // File doesn't exist. get a token.
  return {
    type: PrepareTypes.fetch,
  }
}
