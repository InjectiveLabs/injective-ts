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
} from '@injectivelabs/chain-api/cosmos/staking/v1beta1/staking_pb'
import { Params as GrpcInsuranceParams } from '@injectivelabs/chain-api/injective/insurance/v1beta1/insurance_pb'
import { Params as GrpcMintParams } from '@injectivelabs/chain-api/cosmos/mint/v1beta1/mint_pb'
import { Params as GrpcPeggyParams } from '@injectivelabs/chain-api/injective/peggy/v1/genesis_pb'
import { Params as GrpcOracleParams } from '@injectivelabs/chain-api/injective/oracle/v1beta1/oracle_pb'
import {
  DelegationDelegatorReward as GrpcDelegationDelegatorReward,
  Params as GrpcDistributionParams,
} from '@injectivelabs/chain-api/cosmos/distribution/v1beta1/distribution_pb'
import {
  Proposal as GrpcProposal,
  Deposit as GrpcProposalDeposit,
  TallyParams as GrpcGovernanceTallyParams,
  VotingParams as GrpcGovernanceVotingParams,
  DepositParams as GrpcGovernanceDepositParams,
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
  Params as GrpcExchangeParams,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/exchange_pb'
import {
  Supply as GrpcSupply,
  Params as GrpcBankParams,
} from '@injectivelabs/chain-api/cosmos/bank/v1beta1/bank_pb'
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
  GrpcGovernanceTallyParams,
  GrpcGovernanceVotingParams,
  GrpcGovernanceDepositParams,
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
  GrpcBankParams,
  GrpcDistributionParams,
  GrpcInsuranceParams,
  GrpcStakingParams,
  GrpcExchangeParams,
  GrpcMintParams,
  GrpcPeggyParams,
  GrpcOracleParams,
}
