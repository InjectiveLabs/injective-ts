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

export {
  GrpcProposal,
  GrpcProposalDeposit,
  GrpcGovernanceTallyParams,
  GrpcGovernanceVotingParams,
  GrpcGovernanceDepositParams,
  GrpcTallyResult,
  GrpcVote,
  GrpcProposalStatus,
}
