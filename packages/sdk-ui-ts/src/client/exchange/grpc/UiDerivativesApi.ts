import { TradeExecutionSide } from '@injectivelabs/ts-types'
import { DerivativesMetrics } from '../../../types/metrics'
import { Base } from './Base'
import {
  DerivativeOrderSide,
  UiBaseDerivativeMarket,
} from '../../../types/derivatives'
import { DerivativeGrpcTransformer } from '@injectivelabs/sdk-ts/dist/client/exchange'
import { Orderbook } from '@injectivelabs/sdk-ts/dist/client/exchange/types/exchange'

export class UiDerivativesApi extends Base {
  async fetchMarkets(): Promise<UiBaseDerivativeMarket[]> {
    const promise = this.exchangeClient.derivatives.fetchMarkets()
    const response = await this.fetchOrFetchAndMeasure(
      promise,
      DerivativesMetrics.FetchMarkets,
    )
    const markets = response.getMarketsList()

    return DerivativeGrpcTransformer.grpcMarketsToMarkets(markets)
  }

  async fetchMarket(marketId: string): Promise<UiBaseDerivativeMarket> {
    const promise = this.exchangeClient.derivatives.fetchMarket(marketId)
    const response = await this.fetchOrFetchAndMeasure(
      promise,
      DerivativesMetrics.FetchMarket,
    )
    const market = response.getMarket()

    if (!market) {
      throw new Error(
        `The derivative market with ${marketId} marketId not found!`,
      )
    }

    return DerivativeGrpcTransformer.grpcMarketToMarket(market)
  }

  async fetchOrderbook(marketId: string) {
    const promise = this.exchangeClient.derivatives.fetchOrderbook(marketId)
    const response = await this.fetchOrFetchAndMeasure(
      promise,
      DerivativesMetrics.FetchOrderbook,
    )
    const orderbook = response.getOrderbook()

    if (!orderbook) {
      throw new Error(
        `The orderbook for the derivative market with ${marketId} marketId not found!`,
      )
    }

    const buys = orderbook.getBuysList()
    const sells = orderbook.getSellsList()

    return DerivativeGrpcTransformer.grpcOrderbookToOrderbook({
      buys,
      sells,
    })
  }

  async fetchMarketsOrderbook(marketIds: string[]): Promise<Orderbook[]> {
    const promise = this.exchangeClient.derivatives.fetchOrderbooks(marketIds)
    const response = await this.fetchOrFetchAndMeasure(
      promise,
      DerivativesMetrics.FetchOrderbook,
    )
    const orderbooks = response.getOrderbooksList()

    return orderbooks
      .map((singleOrderbook) => {
        const orderbook = singleOrderbook.getOrderbook()

        if (!orderbook) {
          return undefined
        }

        const buys = orderbook.getBuysList()
        const sells = orderbook.getSellsList()

        return DerivativeGrpcTransformer.grpcOrderbookToOrderbook({
          buys,
          sells,
        })
      })
      .filter((o) => o) as Orderbook[]
  }

  async fetchTrades({
    marketId,
    subaccountId,
  }: {
    marketId?: string
    subaccountId?: string
  }) {
    // For market wide trades we get only `executionSide=Taker` trades
    const executionSide = subaccountId ? undefined : TradeExecutionSide.Taker
    const promise = this.exchangeClient.derivatives.fetchTrades({
      marketId,
      subaccountId,
      executionSide,
    })
    const response = await this.fetchOrFetchAndMeasure(
      promise,
      DerivativesMetrics.FetchTrades,
    )
    const trades = response.getTradesList()

    return DerivativeGrpcTransformer.grpcTradesToTrades(trades)
  }

  async fetchPositions({
    marketId,
    subaccountId,
  }: {
    marketId?: string
    subaccountId?: string
  }) {
    const promise = this.exchangeClient.derivatives.fetchPositions({
      marketId,
      subaccountId,
    })
    const response = await this.fetchOrFetchAndMeasure(
      promise,
      DerivativesMetrics.FetchPositions,
    )
    const positions = response.getPositionsList()

    return DerivativeGrpcTransformer.grpcPositionsToPositions(positions)
  }

  async fetchOrders({
    marketId,
    subaccountId,
    orderSide,
  }: {
    marketId?: string
    orderSide?: DerivativeOrderSide
    subaccountId: string
  }) {
    const promise = this.exchangeClient.derivatives.fetchOrders({
      marketId,
      orderSide,
      subaccountId,
    })
    const response = await this.fetchOrFetchAndMeasure(
      promise,
      DerivativesMetrics.FetchOrders,
    )
    const orders = response.getOrdersList()

    return DerivativeGrpcTransformer.grpcOrdersToOrders(orders)
  }
}
