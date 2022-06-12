import {
  Validator as GrpcValidator,
  Delegation as GrpcDelegation,
  Description as GrpcValidatorDescription,
  Commission as GrpcValidatorCommission,
  CommissionRates as GrpcValidatorCommissionRates,
  UnbondingDelegation as GrpcUnbondingDelegation,
  Redelegation as GrpcReDelegation,
  DelegationResponse as GrpcDelegationResponse,
  RedelegationResponse as GrpcReDelegationResponse,
  Params as GrpcStakingParams,
  Pool as GrpcPool,
} from '@injectivelabs/chain-api/cosmos/staking/v1beta1/staking_pb'

export interface StakingModuleParams
  extends Omit<GrpcStakingParams.AsObject, 'unbondingTime'> {
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

export {
  GrpcPool,
  GrpcValidator,
  GrpcDelegation,
  GrpcValidatorDescription,
  GrpcValidatorCommission,
  GrpcValidatorCommissionRates,
  GrpcUnbondingDelegation,
  GrpcReDelegation,
  GrpcDelegationResponse,
  GrpcReDelegationResponse,
  GrpcStakingParams,
}
