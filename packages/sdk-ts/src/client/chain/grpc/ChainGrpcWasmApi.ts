import * as CosmwasmWasmV1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/cosmwasm/wasm/v1/query_pb'
import { QueryClient as CosmwasmWasmV1QueryClient } from '@injectivelabs/core-proto-ts-v2/generated/cosmwasm/wasm/v1/query_pb.client'
import { ChainModule } from '../types/index.js'
import { toBase64 } from '../../../utils/encoding.js'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { base64ToUint8Array } from '../../../utils/encoding.js'
import { ChainGrpcWasmTransformer } from '../transformers/index.js'
import { ChainGrpcCommonTransformer } from '../transformers/ChainGrpcCommonTransformer.js'
import type { PaginationOption } from '../../../types/pagination.js'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcWasmApi extends BaseGrpcConsumer {
  protected module: string = ChainModule.Wasm
  private client: CosmwasmWasmV1QueryClient

  constructor(endpoint: string) {
    super(endpoint)
    this.client = new CosmwasmWasmV1QueryClient(this.transport)
  }

  async fetchContractAccountsBalance({
    contractAddress,
    pagination,
  }: {
    contractAddress: string
    pagination?: PaginationOption
  }) {
    const request = CosmwasmWasmV1QueryPb.QueryAllContractStateRequest.create()

    request.address = contractAddress

    const paginationForRequest =
      ChainGrpcCommonTransformer.pageRequestToGrpcPageRequestV2(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    const response = await this.executeGrpcCall<
      CosmwasmWasmV1QueryPb.QueryAllContractStateRequest,
      CosmwasmWasmV1QueryPb.QueryAllContractStateResponse
    >(request, this.client.allContractState.bind(this.client))

    return ChainGrpcWasmTransformer.allContractStateResponseToContractAccountsBalanceWithPagination(
      response,
    )
  }

  async fetchContractState({
    contractAddress,
    pagination,
  }: {
    contractAddress: string
    pagination?: PaginationOption
  }) {
    const request = CosmwasmWasmV1QueryPb.QueryAllContractStateRequest.create()

    request.address = contractAddress

    const paginationForRequest =
      ChainGrpcCommonTransformer.pageRequestToGrpcPageRequestV2(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    const response = await this.executeGrpcCall<
      CosmwasmWasmV1QueryPb.QueryAllContractStateRequest,
      CosmwasmWasmV1QueryPb.QueryAllContractStateResponse
    >(request, this.client.allContractState.bind(this.client))

    return ChainGrpcWasmTransformer.allContractStateResponseToContractState(
      response,
    )
  }

  async fetchContractInfo(contractAddress: string) {
    const request = CosmwasmWasmV1QueryPb.QueryContractInfoRequest.create()

    request.address = contractAddress

    const response = await this.executeGrpcCall<
      CosmwasmWasmV1QueryPb.QueryContractInfoRequest,
      CosmwasmWasmV1QueryPb.QueryContractInfoResponse
    >(request, this.client.contractInfo.bind(this.client))

    const contractInfo = response.contractInfo

    if (!contractInfo) {
      return
    }

    return ChainGrpcWasmTransformer.contactInfoResponseToContractInfo(
      contractInfo,
    )
  }

  async fetchContractHistory(contractAddress: string) {
    const request = CosmwasmWasmV1QueryPb.QueryContractHistoryRequest.create()

    request.address = contractAddress

    const response = await this.executeGrpcCall<
      CosmwasmWasmV1QueryPb.QueryContractHistoryRequest,
      CosmwasmWasmV1QueryPb.QueryContractHistoryResponse
    >(request, this.client.contractHistory.bind(this.client))

    return ChainGrpcWasmTransformer.contactHistoryResponseToContractHistory(
      response,
    )
  }

  async fetchSmartContractState(
    contractAddress: string,
    query?: string | Record<string, any>,
  ) {
    const request =
      CosmwasmWasmV1QueryPb.QuerySmartContractStateRequest.create()

    request.address = contractAddress

    if (query) {
      request.queryData = base64ToUint8Array(
        typeof query === 'string' ? query : toBase64(query),
      )
    }

    const response = await this.executeGrpcCall<
      CosmwasmWasmV1QueryPb.QuerySmartContractStateRequest,
      CosmwasmWasmV1QueryPb.QuerySmartContractStateResponse
    >(request, this.client.smartContractState.bind(this.client))

    return response
  }

  async fetchRawContractState(contractAddress: string, query?: string) {
    const request = CosmwasmWasmV1QueryPb.QueryRawContractStateRequest.create()

    request.address = contractAddress

    if (query) {
      request.queryData = base64ToUint8Array(query)
    }

    const response = await this.executeGrpcCall<
      CosmwasmWasmV1QueryPb.QueryRawContractStateRequest,
      CosmwasmWasmV1QueryPb.QueryRawContractStateResponse
    >(request, this.client.rawContractState.bind(this.client))

    return response
  }

  async fetchContractCodes(pagination?: PaginationOption) {
    const request = CosmwasmWasmV1QueryPb.QueryCodesRequest.create()

    const paginationForRequest =
      ChainGrpcCommonTransformer.pageRequestToGrpcPageRequestV2(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    const response = await this.executeGrpcCall<
      CosmwasmWasmV1QueryPb.QueryCodesRequest,
      CosmwasmWasmV1QueryPb.QueryCodesResponse
    >(request, this.client.codes.bind(this.client))

    return ChainGrpcWasmTransformer.contractCodesResponseToContractCodes(
      response,
    )
  }

  async fetchContractCode(codeId: number) {
    const request = CosmwasmWasmV1QueryPb.QueryCodeRequest.create()

    request.codeId = BigInt(codeId)

    const response = await this.executeGrpcCall<
      CosmwasmWasmV1QueryPb.QueryCodeRequest,
      CosmwasmWasmV1QueryPb.QueryCodeResponse
    >(request, this.client.code.bind(this.client))

    return ChainGrpcWasmTransformer.contractCodeResponseToContractCode(response)
  }

  async fetchContractCodeContracts(
    codeId: number,
    pagination?: PaginationOption,
  ) {
    const request = CosmwasmWasmV1QueryPb.QueryContractsByCodeRequest.create()

    request.codeId = BigInt(codeId)

    const paginationForRequest =
      ChainGrpcCommonTransformer.pageRequestToGrpcPageRequestV2(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    const response = await this.executeGrpcCall<
      CosmwasmWasmV1QueryPb.QueryContractsByCodeRequest,
      CosmwasmWasmV1QueryPb.QueryContractsByCodeResponse
    >(request, this.client.contractsByCode.bind(this.client))

    return ChainGrpcWasmTransformer.contractByCodeResponseToContractByCode(
      response,
    )
  }
}
