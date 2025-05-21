export function decodeBase64(base64String: string): string {
  return `0x${Buffer.from(base64String, 'base64').toString('hex')}`
}
