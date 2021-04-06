import { Query } from '@injectivelabs/chain-api/injective/exchange/v1beta1/query_pb_service'
import { MarketStatusMap } from '@injectivelabs/chain-api/injective/exchange/v1beta1/exchange_pb'
import {
  QuerySpotMarketsRequest,
  QuerySpotMarketRequest,
  QuerySpotMarketResponse,
  QuerySpotMarketsResponse,
  QueryExchangeParamsRequest,
  QueryExchangeParamsResponse,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/query_pb'
import { GrpcException } from '@injectivelabs/exceptions'
import BaseConsumer from '../BaseConsumer'

export class ExchangeConsumer extends BaseConsumer {
  async fetchParams() {
    const request = new QueryExchangeParamsRequest()

    try {
      const response = await this.request<
        QueryExchangeParamsRequest,
        QueryExchangeParamsResponse,
        typeof Query.QueryExchangeParams
      >(request, Query.QueryExchangeParams)

      return response.getParams()
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }

  async fetchSpotMarkets(status: MarketStatusMap[keyof MarketStatusMap]) {
    const request = new QuerySpotMarketsRequest()
    request.setStatus(status)

    try {
      const response = await this.request<
        QuerySpotMarketsRequest,
        QuerySpotMarketsResponse,
        typeof Query.SpotMarkets
      >(request, Query.SpotMarkets)

      return response.getMarketsList()
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }

  async fetchSpotMarket(marketId: string) {
    const request = new QuerySpotMarketRequest()
    request.setMarketId(marketId)

    try {
      const response = await this.request<
        QuerySpotMarketRequest,
        QuerySpotMarketResponse,
        typeof Query.SpotMarket
      >(request, Query.SpotMarket)

      return response.getMarket()
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }
}
