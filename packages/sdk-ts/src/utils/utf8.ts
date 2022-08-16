export function toUtf8(str: string): Uint8Array {
  return new TextEncoder().encode(str)
}

export function fromUtf8(data: Uint8Array): string {
  return new TextDecoder('utf-8', { fatal: true }).decode(data)
}

export function toBase64(data: Record<string, any>): string {
  return Buffer.from(JSON.stringify(data)).toString('base64')
}

export function fromBase64(payload: string): Record<string, any> {
  return JSON.parse(Buffer.from(payload, 'base64').toString())
}
