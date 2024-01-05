import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { CosmosGovV1Gov, CosmosGovV1Query } from '@injectivelabs/core-proto-ts'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer'
import { ChainModule } from '../types'
import { PaginationOption } from '../../../types/pagination'
import { paginationRequestFromPagination } from '../../../utils/pagination'
import { ChainGrpcGovTransformer } from '../transformers/ChainGrpcGovTransformer'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcGovApi extends BaseGrpcConsumer {
  protected module: string = ChainModule.Gov

  protected client: CosmosGovV1Query.QueryClientImpl

  constructor(endpoint: string) {
    super(endpoint)

    this.client = new CosmosGovV1Query.QueryClientImpl(
      this.getGrpcWebImpl(endpoint),
    )
  }

  async fetchModuleParams() {
    const paramTypes = ['voting', 'deposit', 'tallying']
    const requests = paramTypes.map((type) => {
      const request = CosmosGovV1Query.QueryParamsRequest.create()
      request.paramsType = type

      return request
    })

    try {
      const responses = await Promise.all(
        requests.map((request) => this.client.Params(request)),
      )
      const [votingParams, depositParams, tallyParams] = responses

      return ChainGrpcGovTransformer.moduleParamsResponseToModuleParamsByType({
        votingParams: votingParams.params!,
        tallyParams: tallyParams.params!,
        depositParams: depositParams.params!,
      })
    } catch (e: any) {
      if (e instanceof CosmosGovV1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Params',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Params',
        contextModule: this.module,
      })
    }
  }

  async fetchProposals({
    status,
    pagination,
  }: {
    status: CosmosGovV1Gov.ProposalStatus
    pagination?: PaginationOption
  }) {
    const request = CosmosGovV1Query.QueryProposalsRequest.create()

    request.proposalStatus = status

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response =
        await this.retry<CosmosGovV1Query.QueryProposalsResponse>(() =>
          this.client.Proposals(request),
        )

      return ChainGrpcGovTransformer.proposalsResponseToProposals(response)
    } catch (e: any) {
      if (e instanceof CosmosGovV1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Proposals',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Proposals',
        contextModule: this.module,
      })
    }
  }

  async fetchProposal(proposalId: number) {
    const request = CosmosGovV1Query.QueryProposalRequest.create()

    request.proposalId = proposalId.toString()

    try {
      const response = await this.retry<CosmosGovV1Query.QueryProposalResponse>(
        () => this.client.Proposal(request),
      )

      return ChainGrpcGovTransformer.proposalResponseToProposal(response)
    } catch (e: any) {
      if (e instanceof CosmosGovV1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Proposal',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Proposal',
        contextModule: this.module,
      })
    }
  }

  async fetchProposalDeposits({
    proposalId,
    pagination,
  }: {
    proposalId: number
    pagination?: PaginationOption
  }) {
    const request = CosmosGovV1Query.QueryDepositsRequest.create()

    request.proposalId = proposalId.toString()

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response = await this.retry<CosmosGovV1Query.QueryDepositsResponse>(
        () => this.client.Deposits(request),
      )

      return ChainGrpcGovTransformer.depositsResponseToDeposits(response)
    } catch (e: any) {
      if (e instanceof CosmosGovV1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Deposits',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Deposits',
        contextModule: this.module,
      })
    }
  }

  async fetchProposalVotes({
    proposalId,
    pagination,
  }: {
    proposalId: number
    pagination?: PaginationOption
  }) {
    const request = CosmosGovV1Query.QueryVotesRequest.create()

    request.proposalId = proposalId.toString()

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }
    try {
      const response = await this.retry<CosmosGovV1Query.QueryVotesResponse>(
        () => this.client.Votes(request),
      )

      return ChainGrpcGovTransformer.votesResponseToVotes(response)
    } catch (e: any) {
      if (e instanceof CosmosGovV1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Votes',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Votes',
        contextModule: this.module,
      })
    }
  }

  async fetchProposalTally(proposalId: number) {
    const request = CosmosGovV1Query.QueryTallyResultRequest.create()

    request.proposalId = proposalId.toString()
    try {
      const response =
        await this.retry<CosmosGovV1Query.QueryTallyResultResponse>(() =>
          this.client.TallyResult(request),
        )

      return ChainGrpcGovTransformer.tallyResultResponseToTallyResult(response)
    } catch (e: any) {
      if (e instanceof CosmosGovV1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'TallyResult',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'TallyResult',
        contextModule: this.module,
      })
    }
  }
}
