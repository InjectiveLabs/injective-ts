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
