import { decode, type JwtPayload } from 'jsonwebtoken'

export const decodeJwt = (credential: string): JwtPayload | null => {
  const decoded = decode(credential)

  if (decoded && typeof decoded === 'object' && 'email' in decoded) {
    return decoded as JwtPayload
  }

  return null
}
