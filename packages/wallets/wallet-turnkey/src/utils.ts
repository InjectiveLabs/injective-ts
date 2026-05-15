import { sha256 } from '@injectivelabs/sdk-ts/utils'

function generateBase64Url(byteLength: number): string {
  const bytes = new Uint8Array(byteLength)
  crypto.getRandomValues(bytes)

  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

function sha256ToBase64Url(input: string): string {
  const hash = sha256(new TextEncoder().encode(input))

  return btoa(String.fromCharCode(...hash))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

export function generateTwitterPkce() {
  const state = generateBase64Url(32)
  const codeVerifier = generateBase64Url(32)
  const codeChallenge = sha256ToBase64Url(codeVerifier)

  return { state, codeVerifier, codeChallenge }
}

export function generateTwitterUrl({
  clientId,
  redirectUri,
  state,
  codeChallenge,
  scope = 'tweet.read users.read',
}: {
  clientId: string
  redirectUri: string
  state: string
  codeChallenge: string
  scope?: string
}) {
  const url = new URL('https://twitter.com/i/oauth2/authorize')

  url.searchParams.set('state', state)
  url.searchParams.set('scope', scope)
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('redirect_uri', redirectUri)
  url.searchParams.set('code_challenge', codeChallenge)
  url.searchParams.set('code_challenge_method', 'S256')

  return url.toString()
}

export function generateGoogleUrl({
  nonce,
  clientId,
  redirectUri,
  scope = 'openid profile email',
  prompt = 'consent',
}: {
  nonce: string
  clientId: string
  redirectUri: string
  scope?: string
  prompt?: string
}) {
  if (!clientId) {
    throw new Error('Google client ID not found')
  }

  const responseType = 'id_token'

  return `https://accounts.google.com/o/oauth2/v2/auth?prompt=${prompt}&client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&nonce=${nonce}`
}
