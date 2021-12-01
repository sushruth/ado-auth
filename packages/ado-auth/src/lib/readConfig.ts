import { execSync, ExecSyncOptionsWithStringEncoding } from 'child_process'
import { blue, red } from 'kleur/colors'
import { logger } from '../logger/logger'
import { npmString, yarnString } from './constants'

const defaultRegistryRegex =
  /^(https?)?:?\/\/registry\.(yarnpkg|npmjs)\.(com|org).*/i

const adoRegistryRegexes = [
  /^\/\/pkgs\.dev\.azure\.com/i,
  /^\/\/(.*?).pkgs\.visualstudio\.com/i,
]

function isAdoRegistry(registry: string) {
  return adoRegistryRegexes.filter((ex) => ex.test(registry)).length > 0
}

const commands = {
  npm: 'npm config get registry',
  yarn: 'yarn config get registry',
  yarn2: 'yarn config get npmRegistryServer',
}

type Tool = keyof typeof commands

const execParams: ExecSyncOptionsWithStringEncoding = {
  encoding: 'utf8',
  cwd: process.cwd(),
}

function replaceHttps(input: string = '') {
  return input.replace(/^https?:/, '')
}

function getScopeRegistries(tool: Tool) {
  try {
    if (tool === 'npm' || tool === 'yarn') {
      const config = JSON.parse(execSync(`npm config list --json`, execParams))

      const registries: string[] = []

      for (const entry in config) {
        if (/@(.*?):registry/.test(entry)) {
          registries.push(replaceHttps(config[entry]))
        }
      }

      return registries
    } else if (tool === 'yarn2') {
      const registries: string[] = []

      const npmScopes = JSON.parse(
        execSync('yarn config get npmScopes --json', execParams)
      )

      for (const entry of npmScopes) {
        registries.push(replaceHttps(entry.npmRegistryServer))
      }

      return registries
    }
  } catch (error) {
    logger.debug('No scoped registries found')
  }
}

const toolNames: Record<Tool, string> = {
  npm: npmString,
  yarn: yarnString,
  yarn2: yarnString,
}

function isValidRegistryEntry(registry: string) {
  return (
    !/undefined/i.test(registry) &&
    isAdoRegistry(registry) &&
    !defaultRegistryRegex.test(registry)
  )
}

function getRegistry(tool: Exclude<Tool, 'yarn2'>) {
  let registries: string[] = []

  let toolToUse: Tool = tool

  if (tool === 'yarn') {
    const version = execSync('yarn -v', execParams)?.trim()
    const match = version.match(/(\d+)\.*/i)

    if (Number(match?.[1]) >= 2) {
      toolToUse = 'yarn2'
    }
  }

  try {
    const registry = execSync(commands[toolToUse], execParams)?.trim()

    if (isValidRegistryEntry(registry)) {
      registries.push(replaceHttps(registry))
    }

    logger.debug('Trying to add scoped registries')

    for (const entry of getScopeRegistries(toolToUse) || []) {
      if (isValidRegistryEntry(entry)) {
        registries.push(entry)
      }
    }
  } catch (error) {
    logger.debug(
      `Running "${commands[toolToUse]}" resulted in an error - `,
      error
    )
  }

  if (!registries.length) {
    logger.debug(
      `No custom ${toolNames[toolToUse]} Azure DevOps registry found.`
    )
  } else {
    logger.debug(`${toolNames[toolToUse]} config contains these registries -> `)
    for (const registry of registries) {
      logger.debug(`\t ${blue(registry)}`)
    }
  }

  return registries
}

export function readConfig() {
  let npmRegistries: string[] = []

  try {
    npmRegistries.push(...getRegistry('npm'))
  } catch (error) {
    if (error instanceof Error) {
      logger.debug('running npm failed - ', red(error.message))
    }
  }

  let yarnRegistries: string[] = []

  try {
    yarnRegistries.push(...getRegistry('yarn'))
  } catch (error) {
    if (error instanceof Error) {
      logger.debug('running yarn failed - ', red(error.message))
    }
  }

  return new Set(
    [
      ...npmRegistries.flatMap((reg) => getRegistryEntries(reg)),
      ...yarnRegistries.flatMap((reg) => getRegistryEntries(reg)),
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
