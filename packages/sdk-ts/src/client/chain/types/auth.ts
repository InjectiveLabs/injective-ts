import { InjectiveTypesV1Beta1Account } from '@injectivelabs/core-proto-ts'

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

export interface AuthBaseAccount {
  address: string
  pubKey?: PubKey
  accountNumber: number
  sequence: number
}

export interface Account {
  codeHash: string
  baseAccount: AuthBaseAccount
}

export type EthAccount = InjectiveTypesV1Beta1Account.EthAccount
