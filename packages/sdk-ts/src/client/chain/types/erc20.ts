import type { Coin } from '@injectivelabs/ts-types'
import type {
  InjectiveErc20V1Beta1Erc20,
  InjectiveErc20V1Beta1Params,
} from '@injectivelabs/core-proto-ts'

export interface TokenPair {
  /** bank denom */
  bankDenom: string
  /** address of erc20 smart contract that is backed by */
  erc20Address: string
}

export interface Params {
  denomCreationFee?: Coin
}

export type GrpcParams = InjectiveErc20V1Beta1Params.Params
export type GrpcTokenPair = InjectiveErc20V1Beta1Erc20.TokenPair
