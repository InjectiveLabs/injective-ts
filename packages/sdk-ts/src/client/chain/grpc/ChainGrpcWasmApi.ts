import {
  UnspecifiedErrorCode,
  grpcErrorCodeToErrorCode,
  GrpcUnaryRequestException,
} from '@injectivelabs/exceptions'
import { CosmwasmWasmV1Query } from '@injectivelabs/core-proto-ts'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { ChainModule } from '../types/index.js'
import { ChainGrpcWasmTransformer } from '../transformers/index.js'
import { PaginationOption } from '../../../types/pagination.js'
import { paginationRequestFromPagination } from '../../../utils/pagination.js'
import { toBase64 } from '../../../utils/utf8.js'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcWasmApi extends BaseGrpcConsumer {
  protected module: string = ChainModule.Wasm

  protected client: CosmwasmWasmV1Query.QueryClientImpl

  constructor(endpoint: string) {
    super(endpoint)

    this.client = new CosmwasmWasmV1Query.QueryClientImpl(
      this.getGrpcWebImpl(endpoint),
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
      const response =
        await this.retry<CosmwasmWasmV1Query.QueryAllContractStateResponse>(
          () => this.client.AllContractState(request, this.metadata),
        )

      return ChainGrpcWasmTransformer.allContractStateResponseToContractAccountsBalanceWithPagination(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof CosmwasmWasmV1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'AllContractState',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'AllContractState',
        contextModule: this.module,
      })
    }
  }

  async fetchContractState({
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
      const response =
        await this.retry<CosmwasmWasmV1Query.QueryAllContractStateResponse>(
          () => this.client.AllContractState(request, this.metadata),
        )

      return ChainGrpcWasmTransformer.allContractStateResponseToContractState(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof CosmwasmWasmV1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'AllContractState',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'AllContractState',
        contextModule: this.module,
      })
    }
  }

  async fetchContractInfo(contractAddress: string) {
    const request = CosmwasmWasmV1Query.QueryContractInfoRequest.create()

    request.address = contractAddress

    try {
      const response =
        await this.retry<CosmwasmWasmV1Query.QueryContractInfoResponse>(() =>
          this.client.ContractInfo(request, this.metadata),
        )

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
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'ContractInfo',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'ContractInfo',
        contextModule: this.module,
      })
    }
  }

  async fetchContractHistory(contractAddress: string) {
    const request = CosmwasmWasmV1Query.QueryContractHistoryRequest.create()

    request.address = contractAddress

    try {
      const response =
        await this.retry<CosmwasmWasmV1Query.QueryContractHistoryResponse>(() =>
          this.client.ContractHistory(request, this.metadata),
        )

      return ChainGrpcWasmTransformer.contactHistoryResponseToContractHistory(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof CosmwasmWasmV1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'ContractHistory',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'ContractHistory',
        contextModule: this.module,
      })
    }
  }

  async fetchSmartContractState(
    contractAddress: string,
    query?: string | Record<string, any>,
  ) {
    const request = CosmwasmWasmV1Query.QuerySmartContractStateRequest.create()

    request.address = contractAddress

    if (query) {
      request.queryData = Buffer.from(
        typeof query === 'string' ? query : toBase64(query),
        'base64',
      )
    }

    try {
      const response =
        await this.retry<CosmwasmWasmV1Query.QuerySmartContractStateResponse>(
          () => this.client.SmartContractState(request, this.metadata),
        )

      return response
    } catch (e: unknown) {
      if (e instanceof CosmwasmWasmV1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'SmartContractState',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'SmartContractState',
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
      const response =
        await this.retry<CosmwasmWasmV1Query.QueryRawContractStateResponse>(
          () => this.client.RawContractState(request, this.metadata),
        )

      return response
    } catch (e: unknown) {
      if (e instanceof CosmwasmWasmV1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'RawContractState',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'RawContractState',
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
      const response = await this.retry<CosmwasmWasmV1Query.QueryCodesResponse>(
        () => this.client.Codes(request, this.metadata),
      )

      return ChainGrpcWasmTransformer.contractCodesResponseToContractCodes(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof CosmwasmWasmV1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'Codes',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Codes',
        contextModule: this.module,
      })
    }
  }

  async fetchContractCode(codeId: number) {
    const request = CosmwasmWasmV1Query.QueryCodeRequest.create()

    request.codeId = codeId.toString()

    try {
      const response = await this.retry<CosmwasmWasmV1Query.QueryCodeResponse>(
        () => this.client.Code(request, this.metadata),
      )

      return ChainGrpcWasmTransformer.contractCodeResponseToContractCode(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof CosmwasmWasmV1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'Code',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Code',
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
      const response =
        await this.retry<CosmwasmWasmV1Query.QueryContractsByCodeResponse>(() =>
          this.client.ContractsByCode(request, this.metadata),
        )

      return ChainGrpcWasmTransformer.contractByCodeResponseToContractByCode(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof CosmwasmWasmV1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'ContractsByCode',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'ContractsByCode',
        contextModule: this.module,
      })
    }
  }
}
