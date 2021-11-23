import chalk from 'chalk'
import os from 'os'
import path from 'path'
import { auth } from '../api-stuff/auth'
import { refetch } from '../api-stuff/refetch'
import { prepare } from '../file-stuff/prepare'
import { PrepareTypes } from '../file-stuff/prepare.types'
import { logger } from '../logger/logger'
import { writeNpmrc } from '../write-rc/npmrc'
import { writeYarn2rc } from '../write-rc/yarn2rc'
import { readConfig } from './readConfig'
import { CliOptions, Token } from './types'

export async function operate(config: CliOptions) {
	logger.debug('Trying to get registry settings from npm and yarn')
	const registries = readConfig()

	if (!registries.size) {
		return logger.debug('No custom registries found. Skipping ado-auth')
	}

	const rcPath = path.resolve(os.homedir(), '.ado-authrc.json')
	const npmrcPath = path.resolve(os.homedir(), '.npmrc')
	const yarnrcPath = path.resolve(os.homedir(), '.yarnrc.yml')

	const report = prepare(rcPath)

	let token: Token | undefined = undefined

	if (report.type === PrepareTypes.fetch) {
		logger.debug(chalk.bold.magenta('Trying to get auth token'))
		token = await auth(rcPath, config)
	} else if (report.type === PrepareTypes.refetch) {
		logger.debug(chalk.bold.magenta('Trying to refetch auth token'))
		token = await refetch(report.data, rcPath, config)
	} else if (report.type === PrepareTypes.noop) {
		logger.debug(chalk.bold.green('Valid token exists'))
		token = report.data
	}

	if (token) {
		// token exists by now

		writeNpmrc({
			npmrcPath,
			token,
			registries: new Set(registries),
		})

		writeYarn2rc({
			yarnrcPath,
			token,
			registries: new Set(registries),
		})
	}
}
