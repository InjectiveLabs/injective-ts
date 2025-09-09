import type HDNode from 'hdkey'

export type TrezorDerivationPathType = 'bip32' | 'bip44' | 'legacy'

export const TrezorDerivationPathType = {
  Bip32: 'bip32',
  Bip44: 'bip44',
  Legacy: 'legacy',
} as const

export interface TrezorWalletInfo {
  address: string
  hdKey: HDNode
  derivationPath: string
}
