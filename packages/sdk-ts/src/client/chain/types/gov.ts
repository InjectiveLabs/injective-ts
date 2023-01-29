import {
  Proposal as GrpcProposal,
  Deposit as GrpcProposalDeposit,
  TallyParams as GrpcGovernanceTallyParams,
  VotingParams as GrpcGovernanceVotingParams,
  DepositParams as GrpcGovernanceDepositParams,
  TallyResult as GrpcTallyResult,
  Vote as GrpcVote,
  VoteOption,
  ProposalStatus,
} from '@injectivelabs/core-proto-ts/cosmos/gov/v1beta1/gov'
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

export interface Proposal {
  proposalId: number
  content: any
  type: string
  status: ProposalStatus
  submitTime: number
  finalTallyResult: GrpcTallyResult | undefined
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
  VoteOption,
  GrpcProposal,
  GrpcProposalDeposit,
  GrpcGovernanceTallyParams,
  GrpcGovernanceVotingParams,
  GrpcGovernanceDepositParams,
  GrpcTallyResult,
  GrpcVote,
  ProposalStatus,
  ProposalStatus as GrpcProposalStatus,
}
