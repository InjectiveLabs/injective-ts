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
import { ChainGrpcGovTransformer } from '../transformers/ChainGrpcGovTransformer'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcGovApi extends BaseConsumer {
  async fetchModuleParams() {
    const paramTypes = ['voting', 'deposit', 'tallying']
    const requests = paramTypes.map((type) => {
      const request = new QueryGovernanceParamsRequest()
      request.setParamsType(type)

      return request
    })

    try {
      const responses = await Promise.all(
        requests.map((request) =>
          this.request<
            QueryGovernanceParamsRequest,
            QueryGovernanceParamsResponse,
            typeof GovernanceQuery.Params
          >(request, GovernanceQuery.Params),
        ),
      )
      const [votingParams, depositParams, tallyParams] = responses

      return ChainGrpcGovTransformer.moduleParamsResponseToModuleParamsByType({
        votingParams: votingParams.getVotingParams()!,
        tallyParams: tallyParams.getTallyParams()!,
        depositParams: depositParams.getDepositParams()!,
      })
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

      return ChainGrpcGovTransformer.proposalsResponseToProposals(response)
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

      return ChainGrpcGovTransformer.proposalResponseToProposal(response)
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

      return ChainGrpcGovTransformer.depositsResponseToDeposits(response)
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

      return ChainGrpcGovTransformer.votesResponseToVotes(response)
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

      return ChainGrpcGovTransformer.tallyResultResponseToTallyResult(response)
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
