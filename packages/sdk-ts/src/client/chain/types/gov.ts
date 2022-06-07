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
import { Coin } from '@injectivelabs/ts-types'

export interface GovModuleStateParams {
  votingParams: {
    votingPeriod: number
  }
  tallyParams: {
    quorum: string
    threshold: string
    vetoThreshold: string
  }
  depositParams: {
    minDepositList: Coin[]
    maxDepositPeriod: number
  }
}

export enum ProposalStatus {
  PROPOSAL_STATUS_UNSPECIFIED = 0,
  PROPOSAL_STATUS_DEPOSIT_PERIOD = 1,
  PROPOSAL_STATUS_VOTING_PERIOD = 2,
  PROPOSAL_STATUS_PASSED = 3,
  PROPOSAL_STATUS_REJECTED = 4,
  PROPOSAL_STATUS_FAILED = 5,
}

export enum VoteOption {
  VOTE_OPTION_UNSPECIFIED = 0,
  VOTE_OPTION_YES = 1,
  VOTE_OPTION_ABSTAIN = 2,
  VOTE_OPTION_NO = 3,
  VOTE_OPTION_NO_WITH_VETO = 4,
}

export interface Proposal {
  proposalId: number
  content: any
  type: string
  status: ProposalStatus
  submitTime: number
  finalTallyResult: GrpcTallyResult.AsObject | undefined
  totalDeposits: Coin[]
  votingStartTime: number
  votingEndTime: number
  depositEndTime: number
}

export type Vote = {
  proposalId: number
  voter: string
  option: VoteOption
}

export type TallyResult = {
  yes: string
  abstain: string
  no: string
  noWithVeto: string
}

export type ProposalDeposit = {
  depositor: string
  amounts: Coin[]
}

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
