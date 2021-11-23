import { getJsonBody } from './getJsonBody'
import https, { RequestOptions } from 'https'
import { URL } from 'url'

export async function simpleFetchJson<ResponseData, RequestBody = unknown>(
	url: string,
	method: https.RequestOptions['method'],
	bodyObject: RequestBody
) {
	const body = JSON.stringify(bodyObject)
	const urlToUse = new URL(url)

	const options: RequestOptions = {
		hostname: urlToUse.hostname,
		port: 443,
		path: urlToUse.pathname,
		method: method,
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(body),
		},
	}

	return new Promise<ResponseData | undefined>((resolve) => {
		https
			.request(options, async (res) => {
				const body = await getJsonBody<ResponseData>(res)
				resolve(body)
			})
			.end(body)
	})
}
