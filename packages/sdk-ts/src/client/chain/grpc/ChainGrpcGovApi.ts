import {
  QueryClientImpl,
  QueryParamsRequest as QueryGovernanceParamsRequest,
  QueryProposalRequest,
  QueryProposalsRequest,
  QueryDepositsRequest,
  QueryTallyResultRequest,
  QueryVotesRequest,
} from '@injectivelabs/core-proto-ts/cosmos/gov/v1beta1/query'
import { ProposalStatus } from '@injectivelabs/core-proto-ts/cosmos/gov/v1beta1/gov'
import { PaginationOption } from '../../../types/pagination'
import { paginationRequestFromPagination } from '../../../utils/pagination'
import { ChainGrpcGovTransformer } from '../transformers/ChainGrpcGovTransformer'
import { ChainModule } from '../types'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { getGrpcWebImpl } from '../../BaseGrpcWebConsumer'
import { GrpcWebError } from '@injectivelabs/core-proto-ts/tendermint/abci/types'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcGovApi {
  protected module: string = ChainModule.Gov

  protected client: QueryClientImpl

  constructor(endpoint: string) {
    this.client = new QueryClientImpl(getGrpcWebImpl(endpoint))
  }

  async fetchModuleParams() {
    const paramTypes = ['voting', 'deposit', 'tallying']
    const requests = paramTypes.map((type) => {
      const request = QueryGovernanceParamsRequest.create()
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
      if (e instanceof GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchProposals({
    status,
    pagination,
  }: {
    status: ProposalStatus
    pagination?: PaginationOption
  }) {
    const request = QueryProposalsRequest.create()

    request.proposalStatus = status

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response = await this.client.Proposals(request)

      return ChainGrpcGovTransformer.proposalsResponseToProposals(response)
    } catch (e: any) {
      if (e instanceof GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchProposal(proposalId: number) {
    const request = QueryProposalRequest.create()

    request.proposalId = proposalId.toString()

    try {
      const response = await this.client.Proposal(request)

      return ChainGrpcGovTransformer.proposalResponseToProposal(response)
    } catch (e: any) {
      if (e instanceof GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
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
    const request = QueryDepositsRequest.create()

    request.proposalId = proposalId.toString()

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response = await this.client.Deposits(request)

      return ChainGrpcGovTransformer.depositsResponseToDeposits(response)
    } catch (e: any) {
      if (e instanceof GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
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
    const request = QueryVotesRequest.create()

    request.proposalId = proposalId.toString()

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }
    try {
      const response = await this.client.Votes(request)

      return ChainGrpcGovTransformer.votesResponseToVotes(response)
    } catch (e: any) {
      if (e instanceof GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchProposalTally(proposalId: number) {
    const request = QueryTallyResultRequest.create()

    request.proposalId = proposalId.toString()
    try {
      const response = await this.client.TallyResult(request)

      return ChainGrpcGovTransformer.tallyResultResponseToTallyResult(response)
    } catch (e: any) {
      if (e instanceof GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }
}
