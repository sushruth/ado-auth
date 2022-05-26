import open from 'open'
import { URL } from 'url'
import { CLIENT_ID } from '../lib/constants'
import { CliOptions } from '../lib/types'
import { writeAdoRc } from '../lib/writeAdoRc'
import { logger } from '../logger/logger'
import { listenForTokenFromTheWebsite } from './server'

function getUrl(clientId = CLIENT_ID, host: string, port: string | number) {
  const hostUrl = new URL(host)
  hostUrl.pathname = '/api/auth'

  return `https://app.vssps.visualstudio.com/oauth2/authorize?client_id=${clientId}&response_type=Assertion&scope=vso.packaging&redirect_uri=${
    hostUrl.href
  }&state=${encodeURIComponent(`{"port":"${port}"}`)}`
}

export async function auth(rcPath: string, config: CliOptions) {
  const url = getUrl(config.clientId, config.host, config.port)

  logger.debug(`Opening ${url}`)

  open(url)

  const result = await listenForTokenFromTheWebsite(config)

  if (result.access_token && result.refresh_token && result.expires_in) {
    writeAdoRc(rcPath, result)
  } else {
    console.error('Something went wrong while fetching refresh token')
  }

  return result
}
