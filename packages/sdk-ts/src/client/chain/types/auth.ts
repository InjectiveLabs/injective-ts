import { EthAccount } from '@injectivelabs/core-proto-ts/injective/types/v1beta1/account'

export interface AuthModuleParams {
  maxMemoCharacters: number
  txSigLimit: number
  txSizeCostPerByte: number
  sigVerifyCostEd25519: number
  sigVerifyCostSecp256k1: number
}

export interface PubKey {
  key: string
  typeUrl: string
}

export interface BaseAccount {
  address: string
  pubKey?: PubKey
  accountNumber: number
  sequence: number
}

export interface Account {
  codeHash: string
  baseAccount: BaseAccount
}

export { EthAccount }
