// Browser-compatible HDNode-like interface (replaces hdkey dependency)
export interface HDNodeLike {
  publicKey: Buffer
  chainCode: Buffer
}

export const TrezorDerivationPathType = {
  Bip32: 'bip32',
  Bip44: 'bip44',
  Legacy: 'legacy',
} as const

export type TrezorDerivationPathType = typeof TrezorDerivationPathType[keyof typeof TrezorDerivationPathType]

export interface TrezorWalletInfo {
  address: string
  hdKey: HDNodeLike
  derivationPath: string
}
