import * as InjectiveEvmV1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/injective/evm/v1/query_pb'
import { QueryClient as InjectiveEvmV1QueryClient } from '@injectivelabs/core-proto-ts-v2/generated/injective/evm/v1/query_pb.client'
import { ChainModule } from '../types/index.js'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { ChainGrpcEvmTransformer } from '../transformers/index.js'
import type { GrpcWebTransportAdditionalOptions } from '../../../utils/grpc.js'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcEvmApi extends BaseGrpcConsumer {
  protected module: string = ChainModule.Evm

  private client: InjectiveEvmV1QueryClient

  constructor(endpoint: string, options?: GrpcWebTransportAdditionalOptions) {
    super(endpoint, options)

    this.client = new InjectiveEvmV1QueryClient(this.transport)
  }

  async fetchAccount(ethAddress: string) {
    const request = InjectiveEvmV1QueryPb.QueryAccountRequest.create()

    request.address = ethAddress

    const response = await this.executeGrpcCall<
      InjectiveEvmV1QueryPb.QueryAccountRequest,
      InjectiveEvmV1QueryPb.QueryAccountResponse
    >(request, this.client.account.bind(this.client))

    return ChainGrpcEvmTransformer.accountResponseToAccount(response)
  }

  async fetchCosmosAccount(ethAddress: string) {
    const request = InjectiveEvmV1QueryPb.QueryCosmosAccountRequest.create()

    request.address = ethAddress

    const response = await this.executeGrpcCall<
      InjectiveEvmV1QueryPb.QueryCosmosAccountRequest,
      InjectiveEvmV1QueryPb.QueryCosmosAccountResponse
    >(request, this.client.cosmosAccount.bind(this.client))

    return ChainGrpcEvmTransformer.cosmosAccountResponseToCosmosAccount(
      response,
    )
  }

  async fetchValidatorAccount(consAddress: string) {
    const request = InjectiveEvmV1QueryPb.QueryValidatorAccountRequest.create()

    request.consAddress = consAddress

    const response = await this.executeGrpcCall<
      InjectiveEvmV1QueryPb.QueryValidatorAccountRequest,
      InjectiveEvmV1QueryPb.QueryValidatorAccountResponse
    >(request, this.client.validatorAccount.bind(this.client))

    return ChainGrpcEvmTransformer.validatorAccountResponseToValidatorAccount(
      response,
    )
  }

  async fetchBalance(ethAddress: string) {
    const request = InjectiveEvmV1QueryPb.QueryBalanceRequest.create()

    request.address = ethAddress

    const response = await this.executeGrpcCall<
      InjectiveEvmV1QueryPb.QueryBalanceRequest,
      InjectiveEvmV1QueryPb.QueryBalanceResponse
    >(request, this.client.balance.bind(this.client))

    return response.balance
  }

  async fetchStorage(ethAddress: string, key: string) {
    const request = InjectiveEvmV1QueryPb.QueryStorageRequest.create()

    request.address = ethAddress
    request.key = key

    const response = await this.executeGrpcCall<
      InjectiveEvmV1QueryPb.QueryStorageRequest,
      InjectiveEvmV1QueryPb.QueryStorageResponse
    >(request, this.client.storage.bind(this.client))

    return response.value
  }

  async fetchCode(ethAddress: string) {
    const request = InjectiveEvmV1QueryPb.QueryCodeRequest.create()

    request.address = ethAddress

    const response = await this.executeGrpcCall<
      InjectiveEvmV1QueryPb.QueryCodeRequest,
      InjectiveEvmV1QueryPb.QueryCodeResponse
    >(request, this.client.code.bind(this.client))

    return response.code
  }

  async fetchParams() {
    const request = InjectiveEvmV1QueryPb.QueryParamsRequest.create()

    const response = await this.executeGrpcCall<
      InjectiveEvmV1QueryPb.QueryParamsRequest,
      InjectiveEvmV1QueryPb.QueryParamsResponse
    >(request, this.client.params.bind(this.client))

    return ChainGrpcEvmTransformer.paramsResponseToParams(response)
  }

  async fetchBaseFee() {
    const request = InjectiveEvmV1QueryPb.QueryBaseFeeRequest.create()

    const response = await this.executeGrpcCall<
      InjectiveEvmV1QueryPb.QueryBaseFeeRequest,
      InjectiveEvmV1QueryPb.QueryBaseFeeResponse
    >(request, this.client.baseFee.bind(this.client))

    return response.baseFee
  }
}
