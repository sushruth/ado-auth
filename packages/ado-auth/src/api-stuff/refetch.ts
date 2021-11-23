import ora from 'ora'
import { URL } from 'url'
import { AdoAuthApiResponse, CliOptions, TokenStore } from '../lib/types'
import { writeAdoRc } from '../lib/writeAdoRc'
import { logger } from '../logger/logger'
import { simpleFetchJson } from './simpleFetch'

export async function refetch(
	data: TokenStore,
	rcPath: string,
	config: CliOptions
) {
	const url = new URL(config.host)

	url.pathname = 'api/refresh'

	logger.debug(`Calling ${url.href} to refresh token`)

	const spinner = ora({
		text: 'Refetching token',
		prefixText: logger.debugPrefix,
		isEnabled: logger.debugEnabled,
	}).start()

	const result = await simpleFetchJson<AdoAuthApiResponse>(url.href, 'POST', {
		token: data.refresh_token,
		port: config.port,
	})

	if (result?.code === 'SUCCESS') {
		writeAdoRc(rcPath, result.body)
		spinner.succeed('Received refreshed token succesfully.')
		return result.body
	} else {
		spinner.fail('Something went wrong while fetching refresh token')
		logger.debug(result)
	}
}
