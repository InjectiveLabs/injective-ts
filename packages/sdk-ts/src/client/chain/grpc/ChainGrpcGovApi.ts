import { PaginationOption } from '../../../types/pagination'
import { paginationRequestFromPagination } from '../../../utils/pagination'
import { ChainGrpcGovTransformer } from '../transformers/ChainGrpcGovTransformer'
import { ChainModule } from '../types'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { getGrpcWebImpl } from '../../BaseGrpcWebConsumer'
import {
  CosmosGovV1Beta1Query,
  CosmosGovV1Beta1Gov,
} from '@injectivelabs/core-proto-ts'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcGovApi {
  protected module: string = ChainModule.Gov

  protected client: CosmosGovV1Beta1Query.QueryClientImpl

  constructor(endpoint: string) {
    this.client = new CosmosGovV1Beta1Query.QueryClientImpl(
      getGrpcWebImpl(endpoint),
    )
  }

  async fetchModuleParams() {
    const paramTypes = ['voting', 'deposit', 'tallying']
    const requests = paramTypes.map((type) => {
      const request = CosmosGovV1Beta1Query.QueryParamsRequest.create()
      request.paramsType = type

      return request
    })

    try {
      const responses = await Promise.all(
        requests.map((request) => this.client.Params(request)),
      )
      const [votingParams, depositParams, tallyParams] = responses

      return ChainGrpcGovTransformer.moduleParamsResponseToModuleParamsByType({
        votingParams: votingParams.votingParams!,
        tallyParams: tallyParams.tallyParams!,
        depositParams: depositParams.depositParams!,
      })
    } catch (e: any) {
      if (e instanceof CosmosGovV1Beta1Query.GrpcWebError) {
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
    status: CosmosGovV1Beta1Gov.ProposalStatus
    pagination?: PaginationOption
  }) {
    const request = CosmosGovV1Beta1Query.QueryProposalsRequest.create()

    request.proposalStatus = status

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response = await this.client.Proposals(request)

      return ChainGrpcGovTransformer.proposalsResponseToProposals(response)
    } catch (e: any) {
      if (e instanceof CosmosGovV1Beta1Query.GrpcWebError) {
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
    const request = CosmosGovV1Beta1Query.QueryProposalRequest.create()

    request.proposalId = proposalId.toString()

    try {
      const response = await this.client.Proposal(request)

      return ChainGrpcGovTransformer.proposalResponseToProposal(response)
    } catch (e: any) {
      if (e instanceof CosmosGovV1Beta1Query.GrpcWebError) {
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
    const request = CosmosGovV1Beta1Query.QueryDepositsRequest.create()

    request.proposalId = proposalId.toString()

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response = await this.client.Deposits(request)

      return ChainGrpcGovTransformer.depositsResponseToDeposits(response)
    } catch (e: any) {
      if (e instanceof CosmosGovV1Beta1Query.GrpcWebError) {
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
    const request = CosmosGovV1Beta1Query.QueryVotesRequest.create()

    request.proposalId = proposalId.toString()

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }
    try {
      const response = await this.client.Votes(request)

      return ChainGrpcGovTransformer.votesResponseToVotes(response)
    } catch (e: any) {
      if (e instanceof CosmosGovV1Beta1Query.GrpcWebError) {
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
    const request = CosmosGovV1Beta1Query.QueryTallyResultRequest.create()

    request.proposalId = proposalId.toString()
    try {
      const response = await this.client.TallyResult(request)

      return ChainGrpcGovTransformer.tallyResultResponseToTallyResult(response)
    } catch (e: any) {
      if (e instanceof CosmosGovV1Beta1Query.GrpcWebError) {
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
