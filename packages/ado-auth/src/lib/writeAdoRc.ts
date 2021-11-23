import dayjs from 'dayjs'
import fs from 'fs'
import { Token } from './types'

export function writeAdoRc(rcPath: string, response: Token) {
	fs.writeFileSync(
		rcPath,
		JSON.stringify(
			{
				...response,
				expires_on: dayjs()
					.add(Number(response.expires_in), 'seconds')
					.toISOString(),
			},
			null,
			'  '
		),
		'utf8'
	)
}
