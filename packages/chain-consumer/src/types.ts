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
} from '@injectivelabs/chain-api/cosmos/staking/v1beta1/staking_pb'
import { DelegationDelegatorReward as GrpcDelegationDelegatorReward } from '@injectivelabs/chain-api/cosmos/distribution/v1beta1/distribution_pb'
import {
  Proposal as GrpcProposal,
  Deposit as GrpcProposalDeposit,
  TallyParams as GrpcTallyParams,
  TallyResult as GrpcTallyResult,
  Vote as GrpcVote,
  ProposalStatusMap as GrpcProposalStatus,
} from '@injectivelabs/chain-api/cosmos/gov/v1beta1/gov_pb'
import {
  SpotMarket as GrpcSpotMarket,
  MarketStatus as GrpcMarketStatus,
  MarketStatusMap as GrpcMarketStatusMap,
  SpotLimitOrder as GrpcSpotLimitOrder,
  SpotMarketOrder as GrpcSpotMarketOrder,
  SpotOrder as GrpcSpotOrder,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/exchange_pb'
import { Supply as GrpcSupply } from '@injectivelabs/chain-api/cosmos/bank/v1beta1/bank_pb'
import { Coin as GrpcCoin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'

export interface PaginationOption {
  key: string
  offset?: number
  limit?: number
  countTotal?: boolean
}

export {
  GrpcCoin,
  GrpcValidator,
  GrpcDelegation,
  GrpcValidatorDescription,
  GrpcValidatorCommission,
  GrpcValidatorCommissionRates,
  GrpcUnbondingDelegation,
  GrpcDelegationResponse,
  GrpcProposal,
  GrpcProposalDeposit,
  GrpcTallyParams,
  GrpcTallyResult,
  GrpcVote,
  GrpcProposalStatus,
  GrpcSupply,
  GrpcDelegationDelegatorReward,
  GrpcSpotMarket,
  GrpcMarketStatus,
  GrpcMarketStatusMap,
  GrpcSpotLimitOrder,
  GrpcSpotMarketOrder,
  GrpcSpotOrder,
  GrpcReDelegation,
  GrpcReDelegationResponse,
}
