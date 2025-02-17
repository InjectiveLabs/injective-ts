import type HDNode from 'hdkey'

export enum TrezorDerivationPathType {
  Bip32 = 'bip32',
  Bip44 = 'bip44',
}

export interface TrezorWalletInfo {
  address: string
  hdKey: HDNode
  derivationPath: string
}
