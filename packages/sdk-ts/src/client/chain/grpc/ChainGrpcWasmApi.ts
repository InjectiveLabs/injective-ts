import { ChainGrpcWasmTransformer } from '../transformers'
import { PaginationOption } from '../../../types/pagination'
import { paginationRequestFromPagination } from '../../../utils/pagination'
import { ChainModule } from '../types'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { getGrpcWebImpl } from '../../BaseGrpcWebConsumer'
import { CosmwasmWasmV1Query } from '@injectivelabs/core-proto-ts'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcWasmApi {
  protected module: string = ChainModule.Wasm

  protected client: CosmwasmWasmV1Query.QueryClientImpl

  constructor(endpoint: string) {
    this.client = new CosmwasmWasmV1Query.QueryClientImpl(
      getGrpcWebImpl(endpoint),
    )
  }

  async fetchContractAccountsBalance({
    contractAddress,
    pagination,
  }: {
    contractAddress: string
    pagination?: PaginationOption
  }) {
    const request = CosmwasmWasmV1Query.QueryAllContractStateRequest.create()

    request.address = contractAddress

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response = await this.client.AllContractState(request)

      return ChainGrpcWasmTransformer.allContractStateResponseToContractAccountsBalanceWithPagination(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof CosmwasmWasmV1Query.GrpcWebError) {
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

  async fetchContractInfo(contractAddress: string) {
    const request = CosmwasmWasmV1Query.QueryContractInfoRequest.create()

    request.address = contractAddress

    try {
      const response = await this.client.ContractInfo(request)

      const contractInfo = response.contractInfo

      if (!contractInfo) {
        return
      }

      return ChainGrpcWasmTransformer.contactInfoResponseToContractInfo(
        contractInfo,
      )
    } catch (e: unknown) {
      if (e instanceof CosmwasmWasmV1Query.GrpcWebError) {
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

  async fetchContractHistory(contractAddress: string) {
    const request = CosmwasmWasmV1Query.QueryContractHistoryRequest.create()

    request.address = contractAddress

    try {
      const response = await this.client.ContractHistory(request)

      return ChainGrpcWasmTransformer.contactHistoryResponseToContractHistory(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof CosmwasmWasmV1Query.GrpcWebError) {
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

  async fetchSmartContractState(contractAddress: string, query?: string) {
    const request = CosmwasmWasmV1Query.QuerySmartContractStateRequest.create()

    request.address = contractAddress

    if (query) {
      request.queryData = Buffer.from(query, 'base64')
    }

    try {
      const response = await this.client.SmartContractState(request)

      return response
    } catch (e: unknown) {
      if (e instanceof CosmwasmWasmV1Query.GrpcWebError) {
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

  async fetchRawContractState(contractAddress: string, query?: string) {
    const request = CosmwasmWasmV1Query.QueryRawContractStateRequest.create()

    request.address = contractAddress

    if (query) {
      request.queryData = Buffer.from(query, 'base64')
    }

    try {
      const response = await this.client.RawContractState(request)

      return response
    } catch (e: unknown) {
      if (e instanceof CosmwasmWasmV1Query.GrpcWebError) {
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

  async fetchContractCodes(pagination?: PaginationOption) {
    const request = CosmwasmWasmV1Query.QueryCodesRequest.create()

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response = await this.client.Codes(request)

      return ChainGrpcWasmTransformer.contractCodesResponseToContractCodes(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof CosmwasmWasmV1Query.GrpcWebError) {
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

  async fetchContractCode(codeId: number) {
    const request = CosmwasmWasmV1Query.QueryCodeRequest.create()

    request.codeId = codeId.toString()

    try {
      const response = await this.client.Code(request)

      return ChainGrpcWasmTransformer.contractCodeResponseToContractCode(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof CosmwasmWasmV1Query.GrpcWebError) {
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

  async fetchContractCodeContracts(
    codeId: number,
    pagination?: PaginationOption,
  ) {
    const request = CosmwasmWasmV1Query.QueryContractsByCodeRequest.create()

    request.codeId = codeId.toString()

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response = await this.client.ContractsByCode(request)

      return ChainGrpcWasmTransformer.contractByCodeResponseToContractByCode(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof CosmwasmWasmV1Query.GrpcWebError) {
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
