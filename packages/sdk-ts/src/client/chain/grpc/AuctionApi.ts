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

export class AuctionApi extends BaseConsumer {
  async moduleParams() {
    const request = new QueryAuctionParamsResponse()

    try {
      const response = await this.request<
        QueryAuctionParamsRequest,
        QueryAuctionParamsResponse,
        typeof AuctionQuery.AuctionParams
      >(request, AuctionQuery.AuctionParams)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async moduleState() {
    const request = new QueryModuleStateRequest()

    try {
      const response = this.request<
        QueryModuleStateRequest,
        QueryModuleStateResponse,
        typeof AuctionQuery.AuctionModuleState
      >(request, AuctionQuery.AuctionModuleState)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async currentBasket() {
    const request = new QueryCurrentAuctionBasketRequest()

    try {
      const response = this.request<
        QueryCurrentAuctionBasketRequest,
        QueryCurrentAuctionBasketResponse,
        typeof AuctionQuery.CurrentAuctionBasket
      >(request, AuctionQuery.CurrentAuctionBasket)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
