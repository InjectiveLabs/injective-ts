import {
  DelegationDelegatorReward as GrpcDelegationDelegatorReward,
  Params as GrpcDistributionParams,
} from '@injectivelabs/core-proto-ts/cosmos/distribution/v1beta1/distribution'
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

export { GrpcDelegationDelegatorReward, GrpcDistributionParams }
