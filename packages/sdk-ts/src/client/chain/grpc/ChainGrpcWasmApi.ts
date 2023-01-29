import {
  QueryClientImpl,
  QueryAllContractStateRequest,
  QueryContractInfoRequest,
  QueryContractHistoryRequest,
  QuerySmartContractStateRequest,
  QueryCodeRequest,
  QueryCodesRequest,
  QueryContractsByCodeRequest,
  QueryRawContractStateRequest,
} from '@injectivelabs/core-proto-ts/cosmwasm/wasm/v1/query'
import { ChainGrpcWasmTransformer } from '../transformers'
import { PaginationOption } from '../../../types/pagination'
import { paginationRequestFromPagination } from '../../../utils/pagination'
import { ChainModule } from '../types'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { getRpcInterface } from '../../BaseGrpcConsumer'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcWasmApi {
  protected module: string = ChainModule.Wasm

  protected query: QueryClientImpl

  constructor(endpoint: string) {
    this.query = new QueryClientImpl(getRpcInterface(endpoint))
  }

  async fetchContractAccountsBalance({
    contractAddress,
    pagination,
  }: {
    contractAddress: string
    pagination?: PaginationOption
  }) {
    const request = QueryAllContractStateRequest.create()

    request.address = contractAddress

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response = await this.query.AllContractState(request)

      return ChainGrpcWasmTransformer.allContractStateResponseToContractAccountsBalanceWithPagination(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchContractInfo(contractAddress: string) {
    const request = QueryContractInfoRequest.create()

    request.address = contractAddress

    try {
      const response = await this.query.ContractInfo(request)

      const contractInfo = response.contractInfo

      if (!contractInfo) {
        return
      }

      return ChainGrpcWasmTransformer.contactInfoResponseToContractInfo(
        contractInfo,
      )
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchContractHistory(contractAddress: string) {
    const request = QueryContractHistoryRequest.create()

    request.address = contractAddress

    try {
      const response = await this.query.ContractHistory(request)

      return ChainGrpcWasmTransformer.contactHistoryResponseToContractHistory(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchSmartContractState(contractAddress: string, query?: string) {
    const request = QuerySmartContractStateRequest.create()

    request.address = contractAddress

    if (query) {
      request.queryData = Buffer.from(query, 'base64')
    }

    try {
      const response = await this.query.SmartContractState(request)

      return response
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchRawContractState(contractAddress: string, query?: string) {
    const request = QueryRawContractStateRequest.create()

    request.address = contractAddress

    if (query) {
      request.queryData = Buffer.from(query, 'base64')
    }

    try {
      const response = await this.query.RawContractState(request)

      return response
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchContractCodes(pagination?: PaginationOption) {
    const request = QueryCodesRequest.create()

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response = await this.query.Codes(request)

      return ChainGrpcWasmTransformer.contractCodesResponseToContractCodes(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchContractCode(codeId: number) {
    const request = QueryCodeRequest.create()

    request.codeId = codeId.toString()

    try {
      const response = await this.query.Code(request)

      return ChainGrpcWasmTransformer.contractCodeResponseToContractCode(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchContractCodeContracts(
    codeId: number,
    pagination?: PaginationOption,
  ) {
    const request = QueryContractsByCodeRequest.create()

    request.codeId = codeId.toString()

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response = await this.query.ContractsByCode(request)

      return ChainGrpcWasmTransformer.contractByCodeResponseToContractByCode(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }
}
