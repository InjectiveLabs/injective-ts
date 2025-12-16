import type * as CosmosStakingV1Beta1StakingPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/staking/v1beta1/staking_pb'

export interface StakingModuleParams extends Omit<
  GrpcStakingParams,
  'unbondingTime'
> {
  unbondingTime: number
}

export interface Delegation {
  delegation: {
    delegatorAddress: string
    validatorAddress: string
    shares: string
  }
  balance: {
    denom: string
    amount: string
  }
}

export interface ReDelegation {
  delegation: {
    delegatorAddress: string
    sourceValidatorAddress: string
    completionTime: number
    destinationValidatorAddress: string
  }
  balance: string
}

export interface UnBondingDelegation {
  delegatorAddress: string
  validatorAddress: string
  creationHeight: number
  completionTime: number
  initialBalance: string
  balance: string
}

export interface Pool {
  notBondedTokens: string
  bondedTokens: string
}

export type BondStatus = 'UnBonded' | 'UnBonding' | 'Bonded'

export const BondStatus = {
  UnBonded: 'UnBonded',
  UnBonding: 'UnBonding',
  Bonded: 'Bonded',
} as const

export interface ValidatorDescription {
  moniker: string
  identity: string
  website: string
  securityContact: string
  details: string
}

export interface ValidatorCommission {
  commissionRates: {
    rate: string
    maxRate: string
    maxChangeRate: string
  }
  updateTime: Date
}

export interface Validator {
  operatorAddress: string
  consensusPubKey?: string
  jailed: boolean
  status: BondStatus
  tokens: string
  delegatorShares: string
  description: ValidatorDescription
  unbondingHeight: number
  unbondingTime: any
  commission: ValidatorCommission
  minSelfDelegation: string
}

export type GrpcValidator = CosmosStakingV1Beta1StakingPb.Validator
export type GrpcDelegation = CosmosStakingV1Beta1StakingPb.Delegation
export type GrpcValidatorDescription = CosmosStakingV1Beta1StakingPb.Description
export type GrpcValidatorCommission = CosmosStakingV1Beta1StakingPb.Commission
export type GrpcValidatorCommissionRates =
  CosmosStakingV1Beta1StakingPb.CommissionRates
export type GrpcUnbondingDelegation =
  CosmosStakingV1Beta1StakingPb.UnbondingDelegation
export type GrpcUnbondingDelegationEntry =
  CosmosStakingV1Beta1StakingPb.UnbondingDelegationEntry
export type GrpcReDelegation = CosmosStakingV1Beta1StakingPb.Redelegation
export type GrpcDelegationResponse =
  CosmosStakingV1Beta1StakingPb.DelegationResponse
export type GrpcReDelegationResponse =
  CosmosStakingV1Beta1StakingPb.RedelegationResponse
export type GrpcReDelegationEntryResponse =
  CosmosStakingV1Beta1StakingPb.RedelegationEntryResponse
export type GrpcStakingParams = CosmosStakingV1Beta1StakingPb.Params
export type GrpcPool = CosmosStakingV1Beta1StakingPb.Pool
