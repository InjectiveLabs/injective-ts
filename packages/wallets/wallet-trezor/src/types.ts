// Browser-compatible HDNode-like interface (replaces hdkey dependency)
export interface HDNodeLike {
  publicKey: Buffer
  chainCode: Buffer
}

export type TrezorDerivationPathType = 'bip32' | 'bip44' | 'legacy'

export const TrezorDerivationPathType = {
  Bip32: 'bip32',
  Bip44: 'bip44',
  Legacy: 'legacy',
} as const

export interface TrezorWalletInfo {
  address: string
  hdKey: HDNodeLike
  derivationPath: string
}
