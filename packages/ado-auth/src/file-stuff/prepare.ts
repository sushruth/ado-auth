import dayjs from 'dayjs'
import fs from 'fs'
import { PrepareReturn, PrepareTypes } from './prepare.types'
import { TokenStore } from '../lib/types'

export function prepare(rcPath: string): PrepareReturn {
	if (fs.existsSync(rcPath)) {
		// handle when file exists
		const file = fs.readFileSync(rcPath, 'utf-8')
		try {
			const data: TokenStore = JSON.parse(file)
			if (!dayjs(data.expires_on).isAfter(dayjs().subtract(1, 'minute'))) {
				// expires in less than 1 minute
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
