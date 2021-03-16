import {
  Validator as GrpcValidator,
  Delegation as GrpcDelegation,
  Description as GrpcValidatorDescription,
  Commission as GrpcValidatorCommission,
  CommissionRates as GrpcValidatorCommissionRates,
  UnbondingDelegation as GrpcUnbondingDelegation,
  DelegationResponse as GrpcDelegationResponse,
} from '@injectivelabs/chain-api/cosmos/staking/v1beta1/staking_pb'
import {
  Proposal as GrpcProposal,
  Deposit as GrpcProposalDeposit,
  TallyParams as GrpcTallyParams,
  TallyResult as GrpcTallyResult,
  Vote as GrpcVote,
  ProposalStatusMap as GrpcProposalStatus,
} from '@injectivelabs/chain-api/cosmos/gov/v1beta1/gov_pb'
import { Supply as GrpcSupply } from '@injectivelabs/chain-api/cosmos/bank/v1beta1/bank_pb'

export {
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
}
