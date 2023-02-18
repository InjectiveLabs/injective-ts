export function fromUtf8(str: Uint8Array | string): Uint8Array {
  if (typeof str !== 'string') {
    return str
  }

  return new TextEncoder().encode(str)
}

export function toUtf8(data: Uint8Array | string): string {
  if (typeof data === 'string') {
    return data
  }

  return new TextDecoder('utf-8', { fatal: true }).decode(data)
}

export function binaryToBase64(data: string | Uint8Array): string {
  return typeof data === 'string' ? data : Buffer.from(data).toString('base64')
}

export function toBase64(data: Record<string, any>): string {
  return Buffer.from(JSON.stringify(data)).toString('base64')
}

export function fromBase64(payload: string): Record<string, any> {
  return JSON.parse(Buffer.from(payload, 'base64').toString())
}
