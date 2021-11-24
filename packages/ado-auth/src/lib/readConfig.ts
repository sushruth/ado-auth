import { execSync } from 'child_process'
import { blue, bold, red } from 'colorette'
import { logger } from '../logger/logger'
import { npmString, yarnString } from './constants'

const defaultRegex = /^(https?)?:?\/\/registry\.(yarnpkg|npmjs)\.(com|org).*/i

const commands = {
  npm: 'npm config get registry',
  yarn: 'yarn config get registry',
  yarn2: 'yarn config get npmRegistryServer',
}

type Tool = keyof typeof commands

const toolNames: Record<Tool, string> = {
  npm: npmString,
  yarn: yarnString,
  yarn2: yarnString,
}

function getRegistry(tool: Exclude<Tool, 'yarn2'>) {
  let registry = ''

  let toolToUse: Tool = tool

  if (tool === 'yarn') {
    const version = execSync('yarn -v', { encoding: 'utf8' })?.trim()
    const match = version.match(/(\d+)\.*/i)

    if (Number(match?.[1]) >= 2) {
      toolToUse = 'yarn2'
    }
  }

  try {
    registry = execSync(commands[toolToUse], {
      encoding: 'utf8',
      cwd: process.cwd(),
    })
      ?.trim()
      .replace(/^https?:/, '') // remove https

    if (defaultRegex.test(registry) || /undefined/i.test(registry)) {
      registry = ''
    }
  } catch (error) {
    logger.debug(
      `Running "${commands[toolToUse]}" resulted in an error - `,
      error
    )
  }

  if (!registry) {
    logger.debug(`No custom ${toolNames[toolToUse]} registry found.`)
  } else {
    logger.debug(
      `${toolNames[toolToUse]} config contains this registry -> `,
      blue(registry)
    )
  }

  return registry
}

export function readConfig() {
  let npmRegistry: string | undefined

  try {
    npmRegistry = getRegistry('npm')
  } catch (error) {
    if (error instanceof Error) {
      logger.debug('running npm failed - ', red(error.message))
    }
  }

  let yarnRegistry: string | undefined

  try {
    yarnRegistry = getRegistry('yarn')
  } catch (error) {
    if (error instanceof Error) {
      logger.debug('running yarn failed - ', red(error.message))
    }
  }

  return new Set(
    [
      ...getRegistryEntries(npmRegistry),
      ...getRegistryEntries(yarnRegistry),
    ].filter(Boolean)
  )
}

/**
 * Helper function to get registry entries needed, for a given ado npm registry
 * @param registry registry url as a string
 * @returns array of two urls - one with the trailing `/` and one without.
 */
function getRegistryEntries(registry?: string) {
  if (!registry) return []
  const withoutTrailingRegistry = registry.replace(/\/registry\/?$/im, '/')
  return [withoutTrailingRegistry, withoutTrailingRegistry + 'registry/']
}
