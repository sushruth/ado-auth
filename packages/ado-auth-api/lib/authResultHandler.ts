import { NextApiResponse } from 'next'
import { AdoAuthApiResponseTypes, Token } from './types'
import { respond } from './respond'

export function authResultHandler(
  res: NextApiResponse,
  result: Token,
  port: string | number
): void {
  if (!result) {
    return respond(res, {
      code: AdoAuthApiResponseTypes.NO_RESULT,
      error: 'No result was received from the auth endpoint',
    })
  } else if (result.access_token && result.refresh_token) {
    res.status(200).setHeader('Content-Type', 'text/html')
    res.send(
      `
<script>
window.history.replaceState({}, document.title, "/process");
localStorage.setItem('token', '${JSON.stringify(result)}');
location.href = '/process?port=${port}';
</script>
`
    )
    return res.end()
  } else {
    return respond(res, {
      code: AdoAuthApiResponseTypes.NO_TOKENS,
      error: 'Result was received but tokens were not found',
      body: result,
    })
  }
}
