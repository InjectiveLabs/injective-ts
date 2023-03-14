import { CosmosDistributionV1Beta1Distribution } from '@injectivelabs/core-proto-ts'
import { Coin } from '@injectivelabs/ts-types'

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
  CosmosDistributionV1Beta1Distribution.DelegationDelegatorReward
export type GrpcDistributionParams =
  CosmosDistributionV1Beta1Distribution.Params
