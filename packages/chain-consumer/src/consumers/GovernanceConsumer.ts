import { PageRequest } from '@injectivelabs/chain-api/cosmos/base/query/v1beta1/pagination_pb'
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
import { PaginationOption } from '../types'

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

  async fetchProposals({
    status,
    pagination,
  }: {
    status: ProposalStatusMap[keyof ProposalStatusMap]
    pagination?: PaginationOption
  }) {
    const request = new QueryProposalsRequest()
    request.setProposalStatus(status)

    if (pagination) {
      const paginationForRequest = new PageRequest()
      paginationForRequest.setKey(pagination.key)

      request.setPagination(paginationForRequest)
    }

    try {
      const response = await this.request<
        QueryProposalsRequest,
        QueryProposalsResponse,
        typeof Query.Proposals
      >(request, Query.Proposals)

      return {
        proposals: response.getProposalsList(),
        pagination: response.getPagination(),
      }
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

  async fetchProposalDeposits({
    proposalId,
    pagination,
  }: {
    proposalId: number
    pagination?: PaginationOption
  }) {
    const request = new QueryDepositsRequest()
    request.setProposalId(proposalId)

    if (pagination) {
      const paginationForRequest = new PageRequest()
      paginationForRequest.setKey(pagination.key)

      request.setPagination(paginationForRequest)
    }

    try {
      const response = await this.request<
        QueryDepositsRequest,
        QueryDepositsResponse,
        typeof Query.Deposits
      >(request, Query.Deposits)

      return {
        deposits: response.getDepositsList(),
        pagination: response.getPagination(),
      }
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }

  async fetchProposalVotes({
    proposalId,
    pagination,
  }: {
    proposalId: number
    pagination?: PaginationOption
  }) {
    const request = new QueryVotesRequest()
    request.setProposalId(proposalId)

    if (pagination) {
      const paginationForRequest = new PageRequest()
      paginationForRequest.setKey(pagination.key)

      request.setPagination(paginationForRequest)
    }

    try {
      const response = await this.request<
        QueryVotesRequest,
        QueryVotesResponse,
        typeof Query.Votes
      >(request, Query.Votes)

      return {
        votes: response.getVotesList(),
        pagination: response.getPagination(),
      }
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
