import { EthAccount } from '@injectivelabs/chain-api/injective/types/v1beta1/account_pb'

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
