import fs from 'fs'
import { blue, bold, cyan, green } from 'kleur/colors'
import os from 'os'
import path from 'path'
import { AUTH_DELIMITER } from '../lib/constants'
import { Token } from '../lib/types'
import { logger } from '../logger/logger'

type WriteNpmrcParams = {
  npmrcPath: string
  registries: Set<string>
  token: Token
}

export function writeNpmrc({ npmrcPath, registries, token }: WriteNpmrcParams) {
  let newNpmRc = ''

  logger.debug(`${bold(`${registries.size}`)} registries to be updated`)

  if (fs.existsSync(npmrcPath)) {
    logger.debug(`found ${cyan(bold('.npmrc'))} in home directory`)

    const npmrc = fs.readFileSync(npmrcPath, 'utf-8')

    for (const line of npmrc.split(/\n/)) {
      /**
       * Yarn 2 seems to add another entry to .npmrc for each URL with the trailing `registry/` removed.
       * Need to address that.
       */

      if (/^\/\//.test(line)) {
        // starts with `//`
        const [url] = line.split(AUTH_DELIMITER)
        const matchingRegistry = [...registries].find((reg) => reg === url)

        if (matchingRegistry) {
          logger.debug(
            `Adding a token to the "${blue(matchingRegistry)}" entry`
          )
          newNpmRc += url + AUTH_DELIMITER + token.access_token + '\n'
          registries.delete(matchingRegistry)
        } else {
          newNpmRc += line + '\n'
        }
      }
    }
  } else {
    logger.debug(`No ${cyan(bold('.npmrc'))} in home directory`)
  }

  // if registries are still left
  for (const registry of registries.values()) {
    logger.debug(`Adding a new entry "${blue(registry)}" with token`)
    registries.delete(registry)
    newNpmRc += registry + AUTH_DELIMITER + token?.access_token + '\n'
  }

  if (newNpmRc) {
    logger.debug('✏️ ', green(`Writing`), cyan(bold('~/.npmrc')))
    fs.writeFileSync(path.resolve(os.homedir(), '.npmrc'), newNpmRc)
  }
}
