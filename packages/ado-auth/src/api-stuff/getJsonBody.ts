import { IncomingMessage } from 'http'

export async function getJsonBody<D>(req: IncomingMessage) {
	return new Promise<D | undefined>(async (resolve, reject) => {
		const body: Uint8Array[] = []
		let jsonBody: D | undefined

		req
			.on('data', (chunk) => {
				body.push(chunk)
			})
			.on('end', () => {
				jsonBody = JSON.parse(Buffer.concat(body).toString())

				if (jsonBody) {
					resolve(jsonBody)
				} else {
					resolve(undefined)
				}
			})
			.on('error', reject)
	})
}
