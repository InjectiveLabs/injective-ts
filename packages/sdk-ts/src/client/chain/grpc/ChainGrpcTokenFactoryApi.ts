import * as InjectiveTokenFactoryV1Beta1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/injective/tokenfactory/v1beta1/query_pb'
import { QueryClient as InjectiveTokenFactoryV1Beta1QueryClient } from '@injectivelabs/core-proto-ts-v2/generated/injective/tokenfactory/v1beta1/query_pb.client'
import { ChainModule } from '../types/index.js'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { ChainGrpcTokenFactoryTransformer } from '../index.js'
import type { GrpcCallOptions } from '../../../types/index.js'
/**
 * @category TokenFactory Grpc API
 */
export class ChainGrpcTokenFactoryApi extends BaseGrpcConsumer {
  protected module: string = ChainModule.WasmX

  private get client() {
    return this.initClient(InjectiveTokenFactoryV1Beta1QueryClient)
  }

  async fetchDenomsFromCreator(creator: string, options?: GrpcCallOptions) {
    const request =
      InjectiveTokenFactoryV1Beta1QueryPb.QueryDenomsFromCreatorRequest.create()

    request.creator = creator

    const response = await this.executeGrpcCall<
      InjectiveTokenFactoryV1Beta1QueryPb.QueryDenomsFromCreatorRequest,
      InjectiveTokenFactoryV1Beta1QueryPb.QueryDenomsFromCreatorResponse
    >(request, this.client.denomsFromCreator.bind(this.client), options?.signal)

    return ChainGrpcTokenFactoryTransformer.denomsCreatorResponseToDenomsString(
      response,
    )
  }

  async fetchDenomAuthorityMetadata(
    creator: string,
    subDenom: string,
    options?: GrpcCallOptions,
  ) {
    const request =
      InjectiveTokenFactoryV1Beta1QueryPb.QueryDenomAuthorityMetadataRequest.create()

    request.creator = creator
    request.subDenom = subDenom

    const response = await this.executeGrpcCall<
      InjectiveTokenFactoryV1Beta1QueryPb.QueryDenomAuthorityMetadataRequest,
      InjectiveTokenFactoryV1Beta1QueryPb.QueryDenomAuthorityMetadataResponse
    >(
      request,
      this.client.denomAuthorityMetadata.bind(this.client),
      options?.signal,
    )

    return ChainGrpcTokenFactoryTransformer.authorityMetadataResponseToAuthorityMetadata(
      response,
    )
  }

  async fetchModuleParams(options?: GrpcCallOptions) {
    const request =
      InjectiveTokenFactoryV1Beta1QueryPb.QueryParamsRequest.create()

    const response = await this.executeGrpcCall<
      InjectiveTokenFactoryV1Beta1QueryPb.QueryParamsRequest,
      InjectiveTokenFactoryV1Beta1QueryPb.QueryParamsResponse
    >(request, this.client.params.bind(this.client), options?.signal)

    return ChainGrpcTokenFactoryTransformer.moduleParamsResponseToModuleParams(
      response,
    )
  }

  async fetchModuleState(options?: GrpcCallOptions) {
    const request =
      InjectiveTokenFactoryV1Beta1QueryPb.QueryModuleStateRequest.create()

    const response = await this.executeGrpcCall<
      InjectiveTokenFactoryV1Beta1QueryPb.QueryModuleStateRequest,
      InjectiveTokenFactoryV1Beta1QueryPb.QueryModuleStateResponse
    >(
      request,
      this.client.tokenfactoryModuleState.bind(this.client),
      options?.signal,
    )

    return ChainGrpcTokenFactoryTransformer.moduleStateResponseToModuleState(
      response,
    )
  }
}
