import { Query } from '@injectivelabs/chain-api/injective/auction/v1beta1//query_pb_service'
import {
  QueryAuctionParamsRequest,
  QueryAuctionParamsResponse,
  QueryModuleStateRequest,
  QueryModuleStateResponse,
  QueryCurrentAuctionBasketRequest,
  QueryCurrentAuctionBasketResponse,
} from '@injectivelabs/chain-api/injective/auction/v1beta1/query_pb'
import { GrpcException } from '@injectivelabs/exceptions'
import { GrpcAuctionParams } from '../types'
import BaseConsumer from '../BaseConsumer'

export class AuctionConsumer extends BaseConsumer {
  async fetchParams() {
    const request = new QueryAuctionParamsResponse()

    try {
      const response = await this.request<
        QueryAuctionParamsRequest,
        QueryAuctionParamsResponse,
        typeof Query.AuctionParams
      >(request, Query.AuctionParams)

      return response.getParams() as GrpcAuctionParams
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async fetchModuleState() {
    const request = new QueryModuleStateRequest()

    try {
      return await this.request<
        QueryModuleStateRequest,
        QueryModuleStateResponse,
        typeof Query.AuctionModuleState
      >(request, Query.AuctionModuleState)
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async fetchCurrentBasket() {
    const request = new QueryCurrentAuctionBasketRequest()

    try {
      return await this.request<
        QueryCurrentAuctionBasketRequest,
        QueryCurrentAuctionBasketResponse,
        typeof Query.CurrentAuctionBasket
      >(request, Query.CurrentAuctionBasket)
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }
}
