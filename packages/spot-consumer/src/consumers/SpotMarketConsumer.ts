import {
  MarketListRequest,
  MarketListResponse,
  MarketDetailsRequest,
  MarketDetailsResponse,
  MarketOrderbookRequest,
  MarketOrderbookResponse,
  MarketOrdersRequest,
  MarketOrdersResponse,
  MarketTradesRequest,
  MarketTradesResponse,
  SpotMarketInfo,
} from '@injectivelabs/exchange-api/injective_spot_markets_rpc_pb'
import { InjectiveSpotMarketsRPC } from '@injectivelabs/exchange-api/injective_spot_markets_rpc_pb_service'
import { GrpcException } from '@injectivelabs/exceptions'
import { AccountAddress } from '@injectivelabs/ts-types'
import BaseConsumer from '../BaseConsumer'

export class SpotMarketConsumer extends BaseConsumer {
  async fetchMarkets() {
    const request = new MarketListRequest()

    try {
      const response = await this.request<
        MarketListRequest,
        MarketListResponse,
        typeof InjectiveSpotMarketsRPC.MarketList
      >(request, InjectiveSpotMarketsRPC.MarketList)

      return response.getMarketsList()
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }

  async fetchMarket(marketId: string): Promise<SpotMarketInfo> {
    const request = new MarketDetailsRequest()
    request.setMarketId(marketId)

    try {
      const response = await this.request<
        MarketDetailsRequest,
        MarketDetailsResponse,
        typeof InjectiveSpotMarketsRPC.MarketDetails
      >(request, InjectiveSpotMarketsRPC.MarketDetails)

      const market = response.getMarket()

      if (!market) {
        throw new GrpcException(`Market with marketId ${marketId} not found`)
      }

      return market
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }

  async fetchMarketOrderbook(marketId: string) {
    const request = new MarketOrderbookRequest()
    request.setMarketId(marketId)

    try {
      const response = await this.request<
        MarketOrderbookRequest,
        MarketOrderbookResponse,
        typeof InjectiveSpotMarketsRPC.MarketOrderbook
      >(request, InjectiveSpotMarketsRPC.MarketOrderbook)

      const orderbook = response.getOrderbook()

      return {
        buys: orderbook ? orderbook.getBuysList() : [],
        sells: orderbook ? orderbook.getSellsList() : [],
      }
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }

  async fetchMarketOrders({
    marketId,
    subaccountId,
  }: {
    marketId: string
    subaccountId?: AccountAddress
  }) {
    const request = new MarketOrdersRequest()
    request.setMarketId(marketId)

    if (subaccountId) {
      request.setSubaccountId(subaccountId)
    }

    try {
      const response = await this.request<
        MarketOrdersRequest,
        MarketOrdersResponse,
        typeof InjectiveSpotMarketsRPC.MarketOrders
      >(request, InjectiveSpotMarketsRPC.MarketOrders)

      return response.getOrdersList()
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }

  async fetchMarketTrades({
    marketId,
    subaccountId,
  }: {
    marketId: string
    subaccountId?: AccountAddress
  }) {
    const request = new MarketTradesRequest()
    request.setMarketId(marketId)

    if (subaccountId) {
      request.setSubaccountId(subaccountId)
    }

    try {
      const response = await this.request<
        MarketTradesRequest,
        MarketTradesResponse,
        typeof InjectiveSpotMarketsRPC.MarketTrades
      >(request, InjectiveSpotMarketsRPC.MarketTrades)

      return response.getTradesList()
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }
}
