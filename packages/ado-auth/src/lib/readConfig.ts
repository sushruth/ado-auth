import { execSync } from 'child_process'
import { logger } from '../logger/logger'

const defaultRegex = /^(https?)?:?\/\/registry\.(yarnpkg|npmjs)\.(com|org).*/i

const commands = {
	npm: 'npm config get registry',
	yarn: 'yarn config get registry',
	yarn2: 'yarn config get npmRegistryServer',
}

function getRegistry(tool: Exclude<keyof typeof commands, 'yarn2'>) {
	let registry = ''

	let toolToUse: keyof typeof commands = tool

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
		logger.debug(`No custom ${toolToUse} registry found.`)
	} else {
		logger.debug(`${toolToUse} config contains this registry -> `, registry)
	}

	return registry
}

export function readConfig() {
	let npmRegistry: string | undefined

	try {
		npmRegistry = getRegistry('npm')
	} catch (error) {
		if (error instanceof Error) {
			logger.debug('running npm failed - ', error.message)
		}
	}

	let yarnRegistry: string | undefined

	try {
		yarnRegistry = getRegistry('yarn')
	} catch (error) {
		if (error instanceof Error) {
			logger.debug('running yarn failed - ', error.message)
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
