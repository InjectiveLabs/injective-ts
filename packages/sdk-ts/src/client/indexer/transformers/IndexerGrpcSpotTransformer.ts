import {
  TradeDirection,
  TradeExecutionSide,
  TradeExecutionType,
} from '@injectivelabs/ts-types'
import { BigNumber } from '@injectivelabs/utils'
import {
  SpotOrderSide,
  SpotOrderState,
  GrpcSpotMarketInfo,
  GrpcSpotLimitOrder,
  SpotOrderHistory,
  GrpcSpotOrderHistory,
  GrpcSpotTrade,
  SpotMarket,
  SpotLimitOrder,
  SpotTrade,
} from '../types/spot'
import {
  GrpcPriceLevel,
  Orderbook,
  PriceLevel,
  GrpcTokenMeta,
  IndexerTokenMeta,
} from '../types/exchange'
import {
  MarketsResponse as SpotMarketsResponse,
  MarketResponse as SpotMarketResponse,
  OrderbookResponse as SpotOrderbookResponse,
  OrdersResponse as SpotOrdersResponse,
  OrdersHistoryResponse as SpotOrdersHistoryResponse,
  TradesResponse as SpotTradesResponse,
  OrderbooksResponse as SpotOrderbooksResponse,
  SubaccountTradesListResponse as SpotSubaccountTradesListResponse,
} from '@injectivelabs/indexer-proto-ts/injective_spot_exchange_rpc'
import { grpcPagingToPaging } from '../../../utils/pagination'

const zeroPriceLevel = () => ({
  price: '0',
  quantity: '0',
  timestamp: 0,
})

/**
 * @category Indexer Grpc Transformer
 */
export class IndexerGrpcSpotTransformer {
  static grpcTokenMetaToTokenMeta(
    tokenMeta: GrpcTokenMeta | undefined,
  ): IndexerTokenMeta | undefined {
    if (!tokenMeta) {
      return
    }

    return {
      name: tokenMeta.name,
      address: tokenMeta.address,
      symbol: tokenMeta.symbol,
      logo: tokenMeta.logo,
      decimals: tokenMeta.decimals,
      updatedAt: tokenMeta.updatedAt,
      coinGeckoId: '',
    }
  }

  static marketResponseToMarket(response: SpotMarketResponse) {
    const market = response.market!

    return IndexerGrpcSpotTransformer.grpcMarketToMarket(market)
  }

  static marketsResponseToMarkets(response: SpotMarketsResponse) {
    const markets = response.markets

    return IndexerGrpcSpotTransformer.grpcMarketsToMarkets(markets)
  }

  static ordersResponseToOrders(response: SpotOrdersResponse) {
    const orders = response.orders
    const pagination = response.paging

    return {
      orders: IndexerGrpcSpotTransformer.grpcOrdersToOrders(orders),
      pagination: grpcPagingToPaging(pagination),
    }
  }

  static orderHistoryResponseToOrderHistory(
    response: SpotOrdersHistoryResponse,
  ) {
    const orderHistory = response.orders
    const pagination = response.paging

    return {
      orderHistory:
        IndexerGrpcSpotTransformer.grpcOrderHistoryListToOrderHistoryList(
          orderHistory,
        ),
      pagination: grpcPagingToPaging(pagination),
    }
  }

  static tradesResponseToTrades(response: SpotTradesResponse) {
    const trades = response.trades
    const pagination = response.paging

    return {
      trades: IndexerGrpcSpotTransformer.grpcTradesToTrades(trades),
      pagination: grpcPagingToPaging(pagination),
    }
  }

  static subaccountTradesListResponseToTradesList(
    response: SpotSubaccountTradesListResponse,
  ) {
    const tradesList = response.trades

    return IndexerGrpcSpotTransformer.grpcTradesToTrades(tradesList)
  }

  static orderbookResponseToOrderbook(response: SpotOrderbookResponse) {
    const orderbook = response.orderbook!

    return IndexerGrpcSpotTransformer.grpcOrderbookToOrderbook({
      buys: orderbook?.buys,
      sells: orderbook?.sells,
    })
  }

  static orderbooksResponseToOrderbooks(response: SpotOrderbooksResponse) {
    const orderbooks = response.orderbooks!

    return orderbooks.map((o) => {
      const orderbook = o.orderbook!

      return {
        marketId: o.marketId,
        orderbook: IndexerGrpcSpotTransformer.grpcOrderbookToOrderbook({
          buys: orderbook.buys,
          sells: orderbook.sells,
        }),
      }
    })
  }

  static grpcMarketToMarket(market: GrpcSpotMarketInfo): SpotMarket {
    return {
      marketId: market.marketId,
      marketStatus: market.marketStatus,
      ticker: market.ticker,
      baseDenom: market.baseDenom,
      quoteDenom: market.quoteDenom,
      quoteToken: IndexerGrpcSpotTransformer.grpcTokenMetaToTokenMeta(
        market.quoteTokenMeta,
      ),
      baseToken: IndexerGrpcSpotTransformer.grpcTokenMetaToTokenMeta(
        market.baseTokenMeta,
      ),
      makerFeeRate: market.makerFeeRate,
      takerFeeRate: market.takerFeeRate,
      serviceProviderFee: market.serviceProviderFee,
      minPriceTickSize: new BigNumber(market.minPriceTickSize).toNumber(),
      minQuantityTickSize: new BigNumber(market.minQuantityTickSize).toNumber(),
    }
  }

  static grpcMarketsToMarkets(markets: GrpcSpotMarketInfo[]): SpotMarket[] {
    return markets.map((market) =>
      IndexerGrpcSpotTransformer.grpcMarketToMarket(market),
    )
  }

  static grpcPriceLevelToPriceLevel(priceLevel: GrpcPriceLevel): PriceLevel {
    return {
      price: priceLevel.price,
      quantity: priceLevel.quantity,
      timestamp: parseInt(priceLevel.timestamp, 10),
    }
  }

  static grpcPriceLevelsToPriceLevels(
    priceLevels: GrpcPriceLevel[],
  ): PriceLevel[] {
    return priceLevels.map((priceLevel) =>
      IndexerGrpcSpotTransformer.grpcPriceLevelToPriceLevel(priceLevel),
    )
  }

  static grpcOrderbookToOrderbook({
    buys,
    sells,
  }: {
    buys: GrpcPriceLevel[]
    sells: GrpcPriceLevel[]
  }): Orderbook {
    return {
      buys: IndexerGrpcSpotTransformer.grpcPriceLevelsToPriceLevels(buys),
      sells: IndexerGrpcSpotTransformer.grpcPriceLevelsToPriceLevels(sells),
    }
  }

  static grpcOrderToOrder(order: GrpcSpotLimitOrder): SpotLimitOrder {
    return {
      orderHash: order.orderHash,
      orderSide: order.orderSide as SpotOrderSide,
      marketId: order.marketId,
      subaccountId: order.subaccountId,
      price: order.price,
      state: order.state as SpotOrderState,
      quantity: order.quantity,
      unfilledQuantity: order.unfilledQuantity,
      triggerPrice: order.triggerPrice,
      feeRecipient: order.feeRecipient,
      createdAt: parseInt(order.createdAt, 10),
      updatedAt: parseInt(order.updatedAt, 10),
    }
  }

  static grpcOrdersToOrders(orders: GrpcSpotLimitOrder[]): SpotLimitOrder[] {
    return orders.map((order) =>
      IndexerGrpcSpotTransformer.grpcOrderToOrder(order),
    )
  }

  static grpcOrderHistoryToOrderHistory(
    orderHistory: GrpcSpotOrderHistory,
  ): SpotOrderHistory {
    return {
      orderHash: orderHistory.orderHash,
      marketId: orderHistory.marketId,
      active: orderHistory.isActive,
      subaccountId: orderHistory.subaccountId,
      executionType: orderHistory.executionType,
      orderType: orderHistory.orderType,
      price: orderHistory.price,
      triggerPrice: orderHistory.triggerPrice,
      quantity: orderHistory.quantity,
      filledQuantity: orderHistory.filledQuantity,
      state: orderHistory.state,
      createdAt: parseInt(orderHistory.createdAt, 10),
      updatedAt: parseInt(orderHistory.updatedAt, 10),
      direction: orderHistory.direction,
    }
  }

  static grpcOrderHistoryListToOrderHistoryList(
    orderHistory: GrpcSpotOrderHistory[],
  ): SpotOrderHistory[] {
    return orderHistory.map((orderHistory) =>
      IndexerGrpcSpotTransformer.grpcOrderHistoryToOrderHistory(orderHistory),
    )
  }

  static grpcTradeToTrade(trade: GrpcSpotTrade): SpotTrade {
    const price = trade.price
    const mappedPrice = price
      ? IndexerGrpcSpotTransformer.grpcPriceLevelToPriceLevel(price)
      : zeroPriceLevel()

    return {
      orderHash: trade.orderHash,
      subaccountId: trade.subaccountId,
      marketId: trade.marketId,
      tradeId: trade.tradeId,
      executedAt: parseInt(trade.executedAt, 10),
      feeRecipient: trade.feeRecipient,
      tradeExecutionType: trade.tradeExecutionType as TradeExecutionType,
      executionSide: trade.executionSide as TradeExecutionSide,
      tradeDirection: trade.tradeDirection as TradeDirection,
      fee: trade.fee,
      ...mappedPrice,
    }
  }

  static grpcTradesToTrades(trades: GrpcSpotTrade[]): SpotTrade[] {
    return trades.map((trade) =>
      IndexerGrpcSpotTransformer.grpcTradeToTrade(trade),
    )
  }
}
