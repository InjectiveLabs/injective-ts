export const hexToBuff = (hex: string) => {
  return Buffer.from(hex.startsWith('0x') ? hex.slice(2) : hex, 'hex')
}

export const hexToBase64 = (hex: string) => {
  return Buffer.from(hex.startsWith('0x') ? hex.slice(2) : hex, 'hex').toString(
    'base64',
  )
}
