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
import {
  GrpcGovernanceDepositParams,
  GrpcGovernanceTallyParams,
  GrpcGovernanceVotingParams,
  PaginationOption,
} from '../types'
import { paginationRequestFromPagination } from '../utils'

export class GovernanceConsumer extends BaseConsumer {
  async fetchParams() {
    const paramTypes = ['voting', 'deposit', 'tallying']
    const requests = paramTypes.map((type) => {
      const request = new QueryParamsRequest()
      request.setParamsType(type)

      return request
    })

    try {
      const responses = await Promise.all(
        requests.map((request) =>
          this.request<
            QueryParamsRequest,
            QueryParamsResponse,
            typeof Query.Params
          >(request, Query.Params),
        ),
      )
      const votingParams = responses.find((response) =>
        response.hasVotingParams(),
      )!
      const tallyParams = responses.find((response) =>
        response.hasTallyParams(),
      )!
      const depositParams = responses.find((response) =>
        response.hasDepositParams(),
      )!

      return {
        votingParams: votingParams.getVotingParams(),
        tallyParams: tallyParams.getTallyParams(),
        depositParams: depositParams.getDepositParams(),
      } as {
        depositParams: GrpcGovernanceDepositParams
        tallyParams: GrpcGovernanceTallyParams
        votingParams: GrpcGovernanceVotingParams
      }
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async fetchParamsByType(type: string) {
    const request = new QueryParamsRequest()
    request.setParamsType(type)

    try {
      const response = await this.request<
        QueryParamsRequest,
        QueryParamsResponse,
        typeof Query.Params
      >(request, Query.Params)

      return response
    } catch (e: any) {
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

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
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
    } catch (e: any) {
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
    } catch (e: any) {
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

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
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
    } catch (e: any) {
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

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
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
    } catch (e: any) {
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
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }
}
