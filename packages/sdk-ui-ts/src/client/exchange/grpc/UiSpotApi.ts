import { TradeExecutionSide } from '@injectivelabs/ts-types'
import { SpotMetrics } from '../../../types/metrics'
import { UiBaseSpotMarket, SpotOrderSide } from '../../../types/spot'
import { Base } from './Base'
import { SpotGrpcTransformer } from '@injectivelabs/sdk-ts/dist/client/exchange'
import { Orderbook } from '@injectivelabs/sdk-ts/dist/client/exchange/types/exchange'

export class UiSpotApi extends Base {
  async fetchMarkets(): Promise<UiBaseSpotMarket[]> {
    const promise = this.exchangeClient.spot.fetchMarkets()
    const response = await this.fetchOrFetchAndMeasure(
      promise,
      SpotMetrics.FetchMarkets,
    )
    const markets = response.getMarketsList()

    return SpotGrpcTransformer.grpcMarketsToMarkets(markets)
  }

  async fetchMarket(marketId: string): Promise<UiBaseSpotMarket> {
    const promise = this.exchangeClient.spot.fetchMarket(marketId)
    const response = await this.fetchOrFetchAndMeasure(
      promise,
      SpotMetrics.FetchMarket,
    )

    const market = response.getMarket()

    if (!market) {
      throw new Error(`The spot market with ${marketId} marketId not found!`)
    }

    return SpotGrpcTransformer.grpcMarketToMarket(market)
  }

  async fetchOrderbook(marketId: string) {
    const promise = this.exchangeClient.spot.fetchOrderbook(marketId)
    const response = await this.fetchOrFetchAndMeasure(
      promise,
      SpotMetrics.FetchOrderbook,
    )

    const orderbook = response.getOrderbook()

    if (!orderbook) {
      throw new Error(
        `The orderbook for the derivative market with ${marketId} marketId not found!`,
      )
    }

    const buys = orderbook.getBuysList()
    const sells = orderbook.getSellsList()

    return SpotGrpcTransformer.grpcOrderbookToOrderbook({ buys, sells })
  }

  async fetchMarketsOrderbook(marketIds: string[]) {
    const promise = this.exchangeClient.spot.fetchOrderbooks(marketIds)
    const response = await this.fetchOrFetchAndMeasure(
      promise,
      SpotMetrics.FetchOrderbook,
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

        return SpotGrpcTransformer.grpcOrderbookToOrderbook({
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
    const promise = this.exchangeClient.spot.fetchTrades({
      marketId,
      subaccountId,
      executionSide,
    })
    const response = await this.fetchOrFetchAndMeasure(
      promise,
      SpotMetrics.FetchTrades,
    )
    const trades = response.getTradesList()

    return SpotGrpcTransformer.grpcTradesToTrades(trades)
  }

  async fetchOrders({
    marketId,
    subaccountId,
    orderSide,
  }: {
    marketId?: string
    orderSide?: SpotOrderSide
    subaccountId: string
  }) {
    const promise = this.exchangeClient.spot.fetchOrders({
      marketId,
      orderSide,
      subaccountId,
    })
    const response = await this.fetchOrFetchAndMeasure(
      promise,
      SpotMetrics.FetchOrders,
    )
    const orders = response.getOrdersList()

    return SpotGrpcTransformer.grpcOrdersToOrders(orders)
  }
}
