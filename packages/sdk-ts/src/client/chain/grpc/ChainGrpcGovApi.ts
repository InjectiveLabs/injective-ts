import * as CosmosGovV1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/gov/v1/query_pb.mjs'
import { QueryClient as CosmosGovV1QueryClient } from '@injectivelabs/core-proto-ts-v2/generated/cosmos/gov/v1/query_pb.client.mjs'
import { ChainModule } from '../types/index.js'
import BaseGrpcConsumerV2 from '../../base/BaseGrpcConsumerV2.js'
import { ChainGrpcGovTransformer } from '../transformers/ChainGrpcGovTransformer.js'
import { ChainGrpcCommonTransformer } from '../transformers/ChainGrpcCommonTransformer.js'
import type * as CosmosGovV1GovPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/gov/v1/gov_pb.mjs'
import type { PaginationOption } from '../../../types/pagination.js'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcGovApi extends BaseGrpcConsumerV2 {
  protected module: string = ChainModule.Gov
  private client: CosmosGovV1QueryClient

  constructor(endpoint: string) {
    super(endpoint)
    this.client = new CosmosGovV1QueryClient(this.transport)
  }

  async fetchModuleParams() {
    const paramTypes = ['voting', 'deposit', 'tallying']
    const requests = paramTypes.map((type) => {
      const request = CosmosGovV1QueryPb.QueryParamsRequest.create()
      request.paramsType = type

      return request
    })

    const responses = await Promise.all(
      requests.map((request) =>
        this.executeGrpcCall<
          CosmosGovV1QueryPb.QueryParamsRequest,
          CosmosGovV1QueryPb.QueryParamsResponse
        >(request, this.client.params.bind(this.client)),
      ),
    )
    const [votingParams, depositParams, tallyParams] = responses

    return ChainGrpcGovTransformer.moduleParamsResponseToModuleParamsByType({
      votingParams: votingParams.params!,
      tallyParams: tallyParams.params!,
      depositParams: depositParams.params!,
    })
  }

  async fetchProposals({
    status,
    pagination,
  }: {
    status: CosmosGovV1GovPb.ProposalStatus
    pagination?: PaginationOption
  }) {
    const request = CosmosGovV1QueryPb.QueryProposalsRequest.create()

    request.proposalStatus = status

    const paginationForRequest =
      ChainGrpcCommonTransformer.pageRequestToGrpcPageRequestV2(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    const response = await this.executeGrpcCall<
      CosmosGovV1QueryPb.QueryProposalsRequest,
      CosmosGovV1QueryPb.QueryProposalsResponse
    >(request, this.client.proposals.bind(this.client))

    return ChainGrpcGovTransformer.proposalsResponseToProposals(response)
  }

  async fetchProposal(proposalId: number) {
    const request = CosmosGovV1QueryPb.QueryProposalRequest.create()

    request.proposalId = BigInt(proposalId)

    const response = await this.executeGrpcCall<
      CosmosGovV1QueryPb.QueryProposalRequest,
      CosmosGovV1QueryPb.QueryProposalResponse
    >(request, this.client.proposal.bind(this.client))

    return ChainGrpcGovTransformer.proposalResponseToProposal(response)
  }

  async fetchProposalDeposits({
    proposalId,
    pagination,
  }: {
    proposalId: number
    pagination?: PaginationOption
  }) {
    const request = CosmosGovV1QueryPb.QueryDepositsRequest.create()

    request.proposalId = BigInt(proposalId)

    const paginationForRequest =
      ChainGrpcCommonTransformer.pageRequestToGrpcPageRequestV2(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    const response = await this.executeGrpcCall<
      CosmosGovV1QueryPb.QueryDepositsRequest,
      CosmosGovV1QueryPb.QueryDepositsResponse
    >(request, this.client.deposits.bind(this.client))

    return ChainGrpcGovTransformer.depositsResponseToDeposits(response)
  }

  async fetchProposalVotes({
    proposalId,
    pagination,
  }: {
    proposalId: number
    pagination?: PaginationOption
  }) {
    const request = CosmosGovV1QueryPb.QueryVotesRequest.create()

    request.proposalId = BigInt(proposalId)

    const paginationForRequest =
      ChainGrpcCommonTransformer.pageRequestToGrpcPageRequestV2(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    const response = await this.executeGrpcCall<
      CosmosGovV1QueryPb.QueryVotesRequest,
      CosmosGovV1QueryPb.QueryVotesResponse
    >(request, this.client.votes.bind(this.client))

    return ChainGrpcGovTransformer.votesResponseToVotes(response)
  }

  async fetchProposalTally(proposalId: number) {
    const request = CosmosGovV1QueryPb.QueryTallyResultRequest.create()

    request.proposalId = BigInt(proposalId)

    const response = await this.executeGrpcCall<
      CosmosGovV1QueryPb.QueryTallyResultRequest,
      CosmosGovV1QueryPb.QueryTallyResultResponse
    >(request, this.client.tallyResult.bind(this.client))

    return ChainGrpcGovTransformer.tallyResultResponseToTallyResult(response)
  }
}
