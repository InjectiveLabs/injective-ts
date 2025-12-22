import * as CosmosGovV1GovPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/gov/v1/gov_pb'
import type { Coin } from '@injectivelabs/ts-types'

export interface GovModuleStateParams {
  votingParams: {
    votingPeriod: number
    expeditedVotingPeriod: number
  }
  tallyParams: {
    quorum: string
    threshold: string
    vetoThreshold: string
    expeditedThreshold: string
  }
  depositParams: {
    minDeposit: Coin[]
    maxDepositPeriod: number
    expeditedMinDeposit: Coin[]
  }
}

export interface Proposal {
  proposalId: number
  title: string
  summary: string
  proposer: string
  content: any
  type: string
  status: CosmosGovV1GovPb.ProposalStatus
  expedited: boolean
  failedReason: string
  submitTime: number
  finalTallyResult: GrpcTallyResult | undefined
  totalDeposits: Coin[]
  votingStartTime: number
  votingEndTime: number
  depositEndTime: number
}

export type WeightedVoteOption = {
  option: CosmosGovV1GovPb.VoteOption
  weight: string
}

export type Vote = {
  proposalId: number
  voter: string
  options: WeightedVoteOption[]
  metadata: string
}

export type TallyResult = {
  yesCount: string
  abstainCount: string
  noCount: string
  noWithVetoCount: string
}

export type ProposalDeposit = {
  depositor: string
  amounts: Coin[]
}

export type GrpcProposal = CosmosGovV1GovPb.Proposal
export type GrpcProposalDeposit = CosmosGovV1GovPb.Deposit
export type GrpcGovernanceTallyParams = CosmosGovV1GovPb.Params
export type GrpcGovernanceVotingParams = CosmosGovV1GovPb.Params
export type GrpcGovernanceDepositParams = CosmosGovV1GovPb.Params
export type GrpcTallyResult = CosmosGovV1GovPb.TallyResult
export type GrpcVote = CosmosGovV1GovPb.Vote

export type VoteOption = CosmosGovV1GovPb.VoteOption
export type ProposalStatus = CosmosGovV1GovPb.ProposalStatus
export const VoteOptionMap = CosmosGovV1GovPb.VoteOption
export const ProposalStatusMap = CosmosGovV1GovPb.ProposalStatus

export type { ProposalStatus as GrpcProposalStatus }
