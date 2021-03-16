import { ProposalStatusMap } from '@injectivelabs/chain-api/cosmos/gov/v1beta1/gov_pb'
import {
  QueryParamsResponse,
  QueryParamsRequest,
  QueryProposalRequest,
  QueryProposalsResponse,
  QueryProposalsRequest,
  QueryProposalResponse,
  QueryDepositsRequest,
  QueryDepositsResponse,
  QueryTallyResultRequest,
  QueryTallyResultResponse,
  QueryVotesRequest,
  QueryVotesResponse,
} from '@injectivelabs/chain-api/cosmos/gov/v1beta1/query_pb'
import { Query } from '@injectivelabs/chain-api/cosmos/gov/v1beta1/query_pb_service'
import { GrpcException } from '@injectivelabs/exceptions'
import BaseConsumer from '../BaseConsumer'

export class GovernanceConsumer extends BaseConsumer {
  async fetchParams(type: string) {
    const request = new QueryParamsRequest()
    request.setParamsType(type)

    try {
      const response = await this.request<
        QueryParamsRequest,
        QueryParamsResponse,
        typeof Query.Params
      >(request, Query.Params)

      return response
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }

  async fetchProposals(status: ProposalStatusMap[keyof ProposalStatusMap]) {
    const request = new QueryProposalsRequest()
    request.setProposalStatus(status)

    try {
      const response = await this.request<
        QueryProposalsRequest,
        QueryProposalsResponse,
        typeof Query.Proposals
      >(request, Query.Proposals)

      return response.getProposalsList()
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }

  async fetchProposal(proposalId: number) {
    const request = new QueryProposalRequest()
    request.setProposalId(proposalId)

    try {
      const response = await this.request<
        QueryProposalRequest,
        QueryProposalResponse,
        typeof Query.Proposal
      >(request, Query.Proposal)

      return response.getProposal()
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }

  async fetchProposalDeposits(proposalId: number) {
    const request = new QueryDepositsRequest()
    request.setProposalId(proposalId)

    try {
      const response = await this.request<
        QueryDepositsRequest,
        QueryDepositsResponse,
        typeof Query.Deposits
      >(request, Query.Deposits)

      return response.getDepositsList()
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }

  async fetchProposalVotes(proposalId: number) {
    const request = new QueryVotesRequest()
    request.setProposalId(proposalId)

    try {
      const response = await this.request<
        QueryVotesRequest,
        QueryVotesResponse,
        typeof Query.Votes
      >(request, Query.Votes)

      return response.getVotesList()
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }

  async fetchProposalTally(proposalId: number) {
    const request = new QueryTallyResultRequest()
    request.setProposalId(proposalId)

    try {
      const response = await this.request<
        QueryTallyResultRequest,
        QueryTallyResultResponse,
        typeof Query.TallyResult
      >(request, Query.TallyResult)

      return response.getTally()
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }
}
