import { CosmosGovV1Gov } from '@injectivelabs/core-proto-ts'
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
  title: string
  summary: string
  proposer: string
  content: any
  type: string
  status: CosmosGovV1Gov.ProposalStatus
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
  option: CosmosGovV1Gov.VoteOption
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

export type GrpcProposal = CosmosGovV1Gov.Proposal
export type GrpcProposalDeposit = CosmosGovV1Gov.Deposit
export type GrpcGovernanceTallyParams = CosmosGovV1Gov.TallyParams
export type GrpcGovernanceVotingParams = CosmosGovV1Gov.VotingParams
export type GrpcGovernanceDepositParams = CosmosGovV1Gov.DepositParams
export type GrpcTallyResult = CosmosGovV1Gov.TallyResult
export type GrpcVote = CosmosGovV1Gov.Vote

export type VoteOption = CosmosGovV1Gov.VoteOption
export type ProposalStatus = CosmosGovV1Gov.ProposalStatus
export const VoteOptionMap = CosmosGovV1Gov.VoteOption
export const ProposalStatusMap = CosmosGovV1Gov.ProposalStatus

export { ProposalStatus as GrpcProposalStatus }
