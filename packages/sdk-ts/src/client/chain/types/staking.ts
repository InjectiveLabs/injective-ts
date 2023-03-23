import { CosmosStakingV1Beta1Staking } from '@injectivelabs/core-proto-ts'

export interface StakingModuleParams
  extends Omit<GrpcStakingParams, 'unbondingTime'> {
  unbondingTime: number
}

export interface Delegation {
  delegation: {
    delegatorAddress: string
    validatorAddress: string
    shares: string // BigNumberInWei
  }
  balance: {
    denom: string
    amount: string // BigNumberInBase
  }
}

export interface ReDelegation {
  delegation: {
    delegatorAddress: string
    sourceValidatorAddress: string
    completionTime: number
    destinationValidatorAddress: string
  }
  balance: string // BigNumberInBase
}

export interface UnBondingDelegation {
  delegatorAddress: string
  validatorAddress: string
  creationHeight: number
  completionTime: number
  initialBalance: string // BigNumberInWei
  balance: string // BigNumberInWei
}

export interface Pool {
  notBondedTokens: string
  bondedTokens: string
}

export enum BondStatus {
  UnBonded = 'UnBonded',
  UnBonding = 'UnBonding',
  Bonded = 'Bonded',
}

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

export type GrpcValidator = CosmosStakingV1Beta1Staking.Validator
export type GrpcDelegation = CosmosStakingV1Beta1Staking.Delegation
export type GrpcValidatorDescription = CosmosStakingV1Beta1Staking.Description
export type GrpcValidatorCommission = CosmosStakingV1Beta1Staking.Commission
export type GrpcValidatorCommissionRates =
  CosmosStakingV1Beta1Staking.CommissionRates
export type GrpcUnbondingDelegation =
  CosmosStakingV1Beta1Staking.UnbondingDelegation
export type GrpcReDelegation = CosmosStakingV1Beta1Staking.Redelegation
export type GrpcDelegationResponse =
  CosmosStakingV1Beta1Staking.DelegationResponse
export type GrpcReDelegationResponse =
  CosmosStakingV1Beta1Staking.RedelegationResponse
export type GrpcStakingParams = CosmosStakingV1Beta1Staking.Params
export type GrpcPool = CosmosStakingV1Beta1Staking.Pool
