import {
  SpotMarketChronosConsumer,
  SpotMarketConsumer,
  SpotOrderSide,
  SpotTransformer,
} from '@injectivelabs/spot-consumer'
import { OracleConsumer } from '@injectivelabs/exchange-consumer'
import { TradeExecutionSide } from '@injectivelabs/ts-types'
import { SpotMetrics, ServiceOptions } from '../../types'
import { BaseService } from '../BaseService'
import { UiBaseSpotMarket, UiSpotMarketSummary } from './types'
import { zeroSpotMarketSummary } from './utils'

export class SpotService extends BaseService {
  protected consumer: SpotMarketConsumer

  protected oracleConsumer: OracleConsumer

  protected chronosConsumer: SpotMarketChronosConsumer

  constructor(options: ServiceOptions) {
    super(options)
    this.consumer = new SpotMarketConsumer(this.endpoints.exchangeApi)
    this.chronosConsumer = new SpotMarketChronosConsumer(
      `${this.endpoints.exchangeApi}/api`,
    )
    this.oracleConsumer = new OracleConsumer(this.endpoints.exchangeApi)
  }

  async fetchMarkets(): Promise<UiBaseSpotMarket[]> {
    const promise = this.consumer.fetchMarkets()
    const markets = await this.fetchOrFetchAndMeasure(
      promise,
      SpotMetrics.FetchMarkets,
    )

    return SpotTransformer.grpcMarketsToMarkets(markets)
  }

  async fetchMarket(marketId: string): Promise<UiBaseSpotMarket> {
    const promise = this.consumer.fetchMarket(marketId)
    const market = await this.fetchOrFetchAndMeasure(
      promise,
      SpotMetrics.FetchMarket,
    )

    return SpotTransformer.grpcMarketToMarket(market)
  }

  async fetchOrderbook(marketId: string) {
    const promise = this.consumer.fetchOrderbook(marketId)
    const orderbook = await this.fetchOrFetchAndMeasure(
      promise,
      SpotMetrics.FetchOrderbook,
    )

    return SpotTransformer.grpcOrderbookToOrderbook(orderbook)
  }

  async fetchMarketsOrderbook(marketIds: string[]) {
    const promise = Promise.all(
      marketIds.map(async (marketId) => this.consumer.fetchOrderbook(marketId)),
    )
    const marketsOrderbook = await this.fetchOrFetchAndMeasure(
      promise,
      SpotMetrics.FetchOrderbook,
    )

    return marketsOrderbook.map((orderbook) =>
      SpotTransformer.grpcOrderbookToOrderbook(orderbook),
    )
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
    const promise = this.consumer.fetchTrades({
      marketId,
      subaccountId,
      executionSide,
    })
    const trades = await this.fetchOrFetchAndMeasure(
      promise,
      SpotMetrics.FetchTrades,
    )

    return SpotTransformer.grpcTradesToTrades(trades)
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
    const promise = this.consumer.fetchOrders({
      marketId,
      orderSide,
      subaccountId,
    })
    const orders = await this.fetchOrFetchAndMeasure(
      promise,
      SpotMetrics.FetchOrders,
    )

    return SpotTransformer.grpcOrdersToOrders(orders)
  }

  async fetchMarketSummary(marketId: string): Promise<UiSpotMarketSummary> {
    const promise = this.chronosConsumer.fetchSpotMarketSummary(marketId)
    const marketSummary = await this.fetchOrFetchAndMeasure(
      promise,
      SpotMetrics.FetchMarketSummary,
    )

    if (!marketSummary) {
      return zeroSpotMarketSummary(marketId)
    }

    return {
      ...marketSummary,
      marketId,
    }
  }

  async fetchMarketsSummary(): Promise<UiSpotMarketSummary[]> {
    const promise = this.chronosConsumer.fetchSpotMarketsSummary()
    const marketsSummary = await this.fetchOrFetchAndMeasure(
      promise,
      SpotMetrics.FetchMarketsSummary,
    )

    return marketsSummary || []
  }
}
