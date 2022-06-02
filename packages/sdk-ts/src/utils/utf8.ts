export function toUtf8(str: string): Uint8Array {
  return new TextEncoder().encode(str)
}

export function fromUtf8(data: Uint8Array): string {
  return new TextDecoder('utf-8', { fatal: true }).decode(data)
}
