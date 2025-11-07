import type { Coin } from '@injectivelabs/ts-types'
import type * as InjectiveErc20V1Beta1Erc20Pb from '@injectivelabs/core-proto-ts-v2/generated/injective/erc20/v1beta1/erc20_pb.mjs'
import type * as InjectiveErc20V1Beta1ParamsPb from '@injectivelabs/core-proto-ts-v2/generated/injective/erc20/v1beta1/params_pb.mjs'

export interface TokenPair {
  /** bank denom */
  bankDenom: string
  /** address of erc20 smart contract that is backed by */
  erc20Address: string
}

export interface Params {
  denomCreationFee?: Coin
}

export type GrpcParams = InjectiveErc20V1Beta1ParamsPb.Params
export type GrpcTokenPair = InjectiveErc20V1Beta1Erc20Pb.TokenPair
