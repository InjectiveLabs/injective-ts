import * as InjectiveAuctionV1Beta1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/injective/auction/v1beta1/query_pb'
import { QueryClient as InjectiveAuctionV1Beta1QueryClient } from '@injectivelabs/core-proto-ts-v2/generated/injective/auction/v1beta1/query_pb.client'
import { ChainModule } from '../types/index.js'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { ChainGrpcAuctionTransformer } from '../transformers/index.js'
import type { GrpcCallOptions } from '../../../types/index.js'
/**
 * @category Chain Grpc API
 */
export class ChainGrpcAuctionApi extends BaseGrpcConsumer {
  protected module: string = ChainModule.Auction

  private get client() {
    return this.initClient(InjectiveAuctionV1Beta1QueryClient)
  }

  async fetchModuleParams(options?: GrpcCallOptions) {
    const request =
      InjectiveAuctionV1Beta1QueryPb.QueryAuctionParamsRequest.create()

    const response = await this.executeGrpcCall<
      InjectiveAuctionV1Beta1QueryPb.QueryAuctionParamsRequest,
      InjectiveAuctionV1Beta1QueryPb.QueryAuctionParamsResponse
    >(request, this.client.auctionParams.bind(this.client), options?.signal)

    return ChainGrpcAuctionTransformer.moduleParamsResponseToModuleParams(
      response,
    )
  }

  async fetchCurrentBasket(options?: GrpcCallOptions) {
    const request =
      InjectiveAuctionV1Beta1QueryPb.QueryCurrentAuctionBasketRequest.create()

    const response = await this.executeGrpcCall<
      InjectiveAuctionV1Beta1QueryPb.QueryCurrentAuctionBasketRequest,
      InjectiveAuctionV1Beta1QueryPb.QueryCurrentAuctionBasketResponse
    >(
      request,
      this.client.currentAuctionBasket.bind(this.client),
      options?.signal,
    )

    return ChainGrpcAuctionTransformer.currentBasketResponseToCurrentBasket(
      response,
    )
  }

  async fetchModuleState(options?: GrpcCallOptions) {
    const request =
      InjectiveAuctionV1Beta1QueryPb.QueryModuleStateRequest.create()

    const response = await this.executeGrpcCall<
      InjectiveAuctionV1Beta1QueryPb.QueryModuleStateRequest,
      InjectiveAuctionV1Beta1QueryPb.QueryModuleStateResponse
    >(
      request,
      this.client.auctionModuleState.bind(this.client),
      options?.signal,
    )

    return ChainGrpcAuctionTransformer.auctionModuleStateResponseToAuctionModuleState(
      response,
    )
  }

  async fetchLastAuctionResult(options?: GrpcCallOptions) {
    const request =
      InjectiveAuctionV1Beta1QueryPb.QueryLastAuctionResultRequest.create()

    const response = await this.executeGrpcCall<
      InjectiveAuctionV1Beta1QueryPb.QueryLastAuctionResultRequest,
      InjectiveAuctionV1Beta1QueryPb.QueryLastAuctionResultResponse
    >(request, this.client.lastAuctionResult.bind(this.client), options?.signal)

    return ChainGrpcAuctionTransformer.lastAuctionResultResponseToLastAuctionResult(
      response,
    )
  }
}
