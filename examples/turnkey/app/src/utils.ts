export function generateGoogleUrl(nonce: string) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  if (!clientId) {
    throw new Error('Google client ID not found')
  }

  const redirectUri = encodeURIComponent('http://localhost:5173')
  const scope = encodeURIComponent('openid profile email')
  const responseType = 'id_token'

  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&nonce=${nonce}`
}
