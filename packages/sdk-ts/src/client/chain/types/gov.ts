import { CosmosGovV1Beta1Gov } from '@injectivelabs/core-proto-ts'
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
  status: CosmosGovV1Beta1Gov.ProposalStatus
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
  option: CosmosGovV1Beta1Gov.VoteOption
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

export type GrpcProposal = CosmosGovV1Beta1Gov.Proposal
export type GrpcProposalDeposit = CosmosGovV1Beta1Gov.Deposit
export type GrpcGovernanceTallyParams = CosmosGovV1Beta1Gov.TallyParams
export type GrpcGovernanceVotingParams = CosmosGovV1Beta1Gov.VotingParams
export type GrpcGovernanceDepositParams = CosmosGovV1Beta1Gov.DepositParams
export type GrpcTallyResult = CosmosGovV1Beta1Gov.TallyResult
export type GrpcVote = CosmosGovV1Beta1Gov.Vote
export const VoteOption = CosmosGovV1Beta1Gov.VoteOption
export const ProposalStatus = CosmosGovV1Beta1Gov.ProposalStatus

export { ProposalStatus as GrpcProposalStatus }
