import fs from 'fs'
import yaml from 'js-yaml'
import { blue, bold, cyan, green } from 'kleur/colors'
import os from 'os'
import path from 'path'
import { Token, YarnRcRegistryPart } from '../lib/types'
import { logger } from '../logger/logger'

type Yarn2RcParams = {
  yarnrcPath: string
  registries: Set<string>
  token: Token
}

export function writeYarn2rc({ registries, token, yarnrcPath }: Yarn2RcParams) {
  let yarnrc: YarnRcRegistryPart = { npmRegistries: {} }

  if (fs.existsSync(yarnrcPath)) {
    logger.debug(`Found ${bold(cyan('.yarnrc.yml'))} in home directory`)

    yarnrc = yaml.load(
      fs.readFileSync(yarnrcPath, 'utf-8')
    ) as YarnRcRegistryPart // assume no throw

    if (!yarnrc.npmRegistries) {
      yarnrc.npmRegistries = {}
    }

    if (yarnrc && typeof yarnrc === 'object') {
      for (const reg of registries) {
        const yarnConfigOfInterest = yarnrc.npmRegistries[reg]
        if (yarnConfigOfInterest) {
          logger.debug(`Adding a token to the "${blue(reg)}" entry`)
          yarnConfigOfInterest.npmAuthToken = token.access_token
          registries.delete(reg)
        }
      }
    }
  } else {
    logger.debug(`No ${cyan(bold('.yarnrc.yml'))} found in home directory`)
  }

  const yarnRcDump = registries.size
    ? [...registries].reduce(
        (acc, value) => {
          return {
            npmRegistries: {
              ...acc.npmRegistries,
              [value]: {
                npmAlwaysAuth: true,
                npmAuthToken: token.access_token,
              },
            },
          }
        },
        {
          npmRegistries: {},
        } as YarnRcRegistryPart
      )
    : {
        npmRegistries: {},
      }

  const contents = yaml.dump({
    npmRegistries: {
      ...yarnRcDump.npmRegistries,
      ...yarnrc.npmRegistries,
    },
  } as YarnRcRegistryPart)

  if (contents) {
    logger.debug('✏️ ', green(`Writing`), cyan(bold('~/.yarnrc.yml')))
    fs.writeFileSync(path.resolve(os.homedir(), '.yarnrc.yml'), contents)
  }
}
