import type HDNode from 'hdkey'


export interface TrezorWalletInfo {
  address: string
  hdKey: HDNode
  derivationPath: string
}
