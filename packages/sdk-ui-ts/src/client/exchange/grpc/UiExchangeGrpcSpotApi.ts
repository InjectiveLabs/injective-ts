import { TradeExecutionSide } from '@injectivelabs/ts-types'
import { SpotMetrics } from '../../../types/metrics'
import { UiBaseSpotMarket, SpotOrderSide } from '../../../types/spot'
import {
  ExchangeGrpcSpotApi,
  ExchangeGrpcSpotTransformer,
} from '@injectivelabs/sdk-ts/client/exchange'
import { Orderbook } from '@injectivelabs/sdk-ts'
import { BaseApi } from '../../../BaseApi'
import { ApiOptions } from '../../../types'

export class UiExchangeGrpcSpotApi extends BaseApi {
  protected client: ExchangeGrpcSpotApi

  constructor(options: ApiOptions) {
    super(options)
    this.client = new ExchangeGrpcSpotApi(options.endpoints.exchangeApi)
  }

  async fetchMarkets(): Promise<UiBaseSpotMarket[]> {
    const promise = this.client.fetchMarkets()
    const response = await this.fetchOrFetchAndMeasure(
      promise,
      SpotMetrics.FetchMarkets,
    )
    const markets = response.getMarketsList()

    return ExchangeGrpcSpotTransformer.grpcMarketsToMarkets(markets)
  }

  async fetchMarket(marketId: string): Promise<UiBaseSpotMarket> {
    const promise = this.client.fetchMarket(marketId)
    const response = await this.fetchOrFetchAndMeasure(
      promise,
      SpotMetrics.FetchMarket,
    )

    const market = response.getMarket()

    if (!market) {
      throw new Error(`The spot market with ${marketId} marketId not found!`)
    }

    return ExchangeGrpcSpotTransformer.grpcMarketToMarket(market)
  }

  async fetchOrderbook(marketId: string) {
    const promise = this.client.fetchOrderbook(marketId)
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

    return ExchangeGrpcSpotTransformer.grpcOrderbookToOrderbook({ buys, sells })
  }

  async fetchMarketsOrderbook(marketIds: string[]) {
    const promise = this.client.fetchOrderbooks(marketIds)
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

        return ExchangeGrpcSpotTransformer.grpcOrderbookToOrderbook({
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
    const promise = this.client.fetchTrades({
      marketId,
      subaccountId,
      executionSide,
    })
    const response = await this.fetchOrFetchAndMeasure(
      promise,
      SpotMetrics.FetchTrades,
    )
    const trades = response.getTradesList()

    return ExchangeGrpcSpotTransformer.grpcTradesToTrades(trades)
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
    const promise = this.client.fetchOrders({
      marketId,
      orderSide,
      subaccountId,
    })
    const response = await this.fetchOrFetchAndMeasure(
      promise,
      SpotMetrics.FetchOrders,
    )
    const orders = response.getOrdersList()

    return ExchangeGrpcSpotTransformer.grpcOrdersToOrders(orders)
  }
}
