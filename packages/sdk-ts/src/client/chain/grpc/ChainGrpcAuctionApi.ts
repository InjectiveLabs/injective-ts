import { Query as AuctionQuery } from '@injectivelabs/chain-api/injective/auction/v1beta1//query_pb_service'
import {
  QueryAuctionParamsRequest,
  QueryAuctionParamsResponse,
  QueryModuleStateRequest,
  QueryModuleStateResponse,
  QueryCurrentAuctionBasketRequest,
  QueryCurrentAuctionBasketResponse,
} from '@injectivelabs/chain-api/injective/auction/v1beta1/query_pb'
import BaseConsumer from '../../BaseGrpcConsumer'
import { ChainGrpcAuctionTransformer } from '../transformers'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcAuctionApi extends BaseConsumer {
  async fetchModuleParams() {
    const request = new QueryAuctionParamsResponse()

    try {
      const response = await this.request<
        QueryAuctionParamsRequest,
        QueryAuctionParamsResponse,
        typeof AuctionQuery.AuctionParams
      >(request, AuctionQuery.AuctionParams)

      return ChainGrpcAuctionTransformer.moduleParamsResponseToModuleParams(
        response,
      )
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchModuleState() {
    const request = new QueryModuleStateRequest()

    try {
      const response = await this.request<
        QueryModuleStateRequest,
        QueryModuleStateResponse,
        typeof AuctionQuery.AuctionModuleState
      >(request, AuctionQuery.AuctionModuleState)

      return ChainGrpcAuctionTransformer.auctionModuleStateResponseToAuctionModuleState(
        response,
      )
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchCurrentBasket() {
    const request = new QueryCurrentAuctionBasketRequest()

    try {
      const response = await this.request<
        QueryCurrentAuctionBasketRequest,
        QueryCurrentAuctionBasketResponse,
        typeof AuctionQuery.CurrentAuctionBasket
      >(request, AuctionQuery.CurrentAuctionBasket)

      return ChainGrpcAuctionTransformer.currentBasketResponseToCurrentBasket(
        response,
      )
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
