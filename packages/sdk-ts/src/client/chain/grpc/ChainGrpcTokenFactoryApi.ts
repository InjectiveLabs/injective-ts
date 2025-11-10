import * as InjectiveTokenFactoryV1Beta1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/injective/tokenfactory/v1beta1/query_pb.mjs'
import { QueryClient as InjectiveTokenFactoryV1Beta1QueryClient } from '@injectivelabs/core-proto-ts-v2/generated/injective/tokenfactory/v1beta1/query_pb.client.mjs'
import { ChainModule } from '../types/index.js'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { ChainGrpcTokenFactoryTransformer } from '../index.js'

/**
 * @category TokenFactory Grpc API
 */
export class ChainGrpcTokenFactoryApi extends BaseGrpcConsumer {
  protected module: string = ChainModule.WasmX
  private client: InjectiveTokenFactoryV1Beta1QueryClient

  constructor(endpoint: string) {
    super(endpoint)
    this.client = new InjectiveTokenFactoryV1Beta1QueryClient(this.transport)
  }

  async fetchDenomsFromCreator(creator: string) {
    const request =
      InjectiveTokenFactoryV1Beta1QueryPb.QueryDenomsFromCreatorRequest.create()

    request.creator = creator

    const response = await this.executeGrpcCall<
      InjectiveTokenFactoryV1Beta1QueryPb.QueryDenomsFromCreatorRequest,
      InjectiveTokenFactoryV1Beta1QueryPb.QueryDenomsFromCreatorResponse
    >(request, this.client.denomsFromCreator.bind(this.client))

    return ChainGrpcTokenFactoryTransformer.denomsCreatorResponseToDenomsString(
      response,
    )
  }

  async fetchDenomAuthorityMetadata(creator: string, subDenom: string) {
    const request =
      InjectiveTokenFactoryV1Beta1QueryPb.QueryDenomAuthorityMetadataRequest.create()

    request.creator = creator
    request.subDenom = subDenom

    const response = await this.executeGrpcCall<
      InjectiveTokenFactoryV1Beta1QueryPb.QueryDenomAuthorityMetadataRequest,
      InjectiveTokenFactoryV1Beta1QueryPb.QueryDenomAuthorityMetadataResponse
    >(request, this.client.denomAuthorityMetadata.bind(this.client))

    return ChainGrpcTokenFactoryTransformer.authorityMetadataResponseToAuthorityMetadata(
      response,
    )
  }

  async fetchModuleParams() {
    const request =
      InjectiveTokenFactoryV1Beta1QueryPb.QueryParamsRequest.create()

    const response = await this.executeGrpcCall<
      InjectiveTokenFactoryV1Beta1QueryPb.QueryParamsRequest,
      InjectiveTokenFactoryV1Beta1QueryPb.QueryParamsResponse
    >(request, this.client.params.bind(this.client))

    return ChainGrpcTokenFactoryTransformer.moduleParamsResponseToModuleParams(
      response,
    )
  }

  async fetchModuleState() {
    const request =
      InjectiveTokenFactoryV1Beta1QueryPb.QueryModuleStateRequest.create()

    const response = await this.executeGrpcCall<
      InjectiveTokenFactoryV1Beta1QueryPb.QueryModuleStateRequest,
      InjectiveTokenFactoryV1Beta1QueryPb.QueryModuleStateResponse
    >(request, this.client.tokenfactoryModuleState.bind(this.client))

    return ChainGrpcTokenFactoryTransformer.moduleStateResponseToModuleState(
      response,
    )
  }
}
