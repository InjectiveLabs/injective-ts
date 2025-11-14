import type { Coin } from '@injectivelabs/ts-types'
import type * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb'
import type * as CosmosDistributionV1Beta1DistributionPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/distribution/v1beta1/distribution_pb'

export interface DistributionModuleParams {
  communityTax: string
  baseProposerReward: string
  bonusProposerReward: string
  withdrawAddrEnabled: boolean
}

export interface ValidatorRewards {
  rewards: Coin[]
  validatorAddress: string
}

export type GrpcDelegationDelegatorReward =
  CosmosDistributionV1Beta1DistributionPb.DelegationDelegatorReward
export type GrpcDistributionParams =
  CosmosDistributionV1Beta1DistributionPb.Params
export type GrpcDecCoin = CosmosBaseV1Beta1CoinPb.DecCoin
