import {
  QueryParamsResponse as QueryGovernanceParamsResponse,
  QueryParamsRequest as QueryGovernanceParamsRequest,
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
import { Query as GovernanceQuery } from '@injectivelabs/chain-api/cosmos/gov/v1beta1/query_pb_service'
import { ProposalStatusMap } from '@injectivelabs/chain-api/cosmos/gov/v1beta1/gov_pb'
import BaseConsumer from '../../BaseGrpcConsumer'
import { PaginationOption } from '../../../types/pagination'
import { paginationRequestFromPagination } from '../../../utils/pagination'

export class ChainGrpcGovApi extends BaseConsumer {
  async fetchParamsByType(type: string) {
    const request = new QueryGovernanceParamsRequest()
    request.setParamsType(type)

    try {
      const response = await this.request<
        QueryGovernanceParamsRequest,
        QueryGovernanceParamsResponse,
        typeof GovernanceQuery.Params
      >(request, GovernanceQuery.Params)

      return response
    } catch (e: any) {
      throw new Error(e.message)
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
        typeof GovernanceQuery.Proposals
      >(request, GovernanceQuery.Proposals)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchProposal(proposalId: number) {
    const request = new QueryProposalRequest()
    request.setProposalId(proposalId)

    try {
      const response = await this.request<
        QueryProposalRequest,
        QueryProposalResponse,
        typeof GovernanceQuery.Proposal
      >(request, GovernanceQuery.Proposal)

      return response
    } catch (e: any) {
      throw new Error(e.message)
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
        typeof GovernanceQuery.Deposits
      >(request, GovernanceQuery.Deposits)

      return response
    } catch (e: any) {
      throw new Error(e.message)
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
        typeof GovernanceQuery.Votes
      >(request, GovernanceQuery.Votes)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchProposalTally(proposalId: number) {
    const request = new QueryTallyResultRequest()
    request.setProposalId(proposalId)

    try {
      const response = await this.request<
        QueryTallyResultRequest,
        QueryTallyResultResponse,
        typeof GovernanceQuery.TallyResult
      >(request, GovernanceQuery.TallyResult)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
