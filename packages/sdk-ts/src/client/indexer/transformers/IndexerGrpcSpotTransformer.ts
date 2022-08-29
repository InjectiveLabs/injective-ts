import { TradeDirection, TradeExecutionType } from '@injectivelabs/ts-types'
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
} from '@injectivelabs/indexer-api/injective_spot_exchange_rpc_pb'
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
      name: tokenMeta.getName(),
      address: tokenMeta.getAddress(),
      symbol: tokenMeta.getSymbol(),
      logo: tokenMeta.getLogo(),
      decimals: tokenMeta.getDecimals(),
      updatedAt: tokenMeta.getUpdatedAt(),
      coinGeckoId: '',
    }
  }

  static marketResponseToMarket(response: SpotMarketResponse) {
    const market = response.getMarket()!

    return IndexerGrpcSpotTransformer.grpcMarketToMarket(market)
  }

  static marketsResponseToMarkets(response: SpotMarketsResponse) {
    const markets = response.getMarketsList()

    return IndexerGrpcSpotTransformer.grpcMarketsToMarkets(markets)
  }

  static ordersResponseToOrders(response: SpotOrdersResponse) {
    const orders = response.getOrdersList()
    const pagination = response.getPaging()

    return {
      orders: IndexerGrpcSpotTransformer.grpcOrdersToOrders(orders),
      pagination: grpcPagingToPaging(pagination),
    }
  }

  static orderHistoryResponseToOrderHistory(
    response: SpotOrdersHistoryResponse,
  ) {
    const orderHistory = response.getOrdersList()
    const pagination = response.getPaging()

    return {
      orderHistory:
        IndexerGrpcSpotTransformer.grpcOrderHistoryListToOrderHistoryList(
          orderHistory,
        ),
      pagination: grpcPagingToPaging(pagination),
    }
  }

  static tradesResponseToTrades(response: SpotTradesResponse) {
    const trades = response.getTradesList()
    const pagination = response.getPaging()

    return {
      trades: IndexerGrpcSpotTransformer.grpcTradesToTrades(trades),
      pagination: grpcPagingToPaging(pagination),
    }
  }

  static subaccountTradesListResponseToTradesList(
    response: SpotSubaccountTradesListResponse,
  ) {
    const tradesList = response.getTradesList()

    return IndexerGrpcSpotTransformer.grpcTradesToTrades(tradesList)
  }

  static orderbookResponseToOrderbook(response: SpotOrderbookResponse) {
    const orderbook = response.getOrderbook()!

    return IndexerGrpcSpotTransformer.grpcOrderbookToOrderbook({
      buys: orderbook?.getBuysList(),
      sells: orderbook?.getSellsList(),
    })
  }

  static orderbooksResponseToOrderbooks(response: SpotOrderbooksResponse) {
    const orderbooks = response.getOrderbooksList()!

    return orderbooks.map((o) => {
      const orderbook = o.getOrderbook()!

      return {
        marketId: o.getMarketId(),
        orderbook: IndexerGrpcSpotTransformer.grpcOrderbookToOrderbook({
          buys: orderbook.getBuysList(),
          sells: orderbook.getSellsList(),
        }),
      }
    })
  }

  static grpcMarketToMarket(market: GrpcSpotMarketInfo): SpotMarket {
    return {
      marketId: market.getMarketId(),
      marketStatus: market.getMarketStatus(),
      ticker: market.getTicker(),
      baseDenom: market.getBaseDenom(),
      quoteDenom: market.getQuoteDenom(),
      quoteToken: IndexerGrpcSpotTransformer.grpcTokenMetaToTokenMeta(
        market.getQuoteTokenMeta(),
      ),
      baseToken: IndexerGrpcSpotTransformer.grpcTokenMetaToTokenMeta(
        market.getBaseTokenMeta(),
      ),
      makerFeeRate: market.getMakerFeeRate(),
      takerFeeRate: market.getTakerFeeRate(),
      serviceProviderFee: market.getServiceProviderFee(),
      minPriceTickSize: new BigNumber(market.getMinPriceTickSize()).toNumber(),
      minQuantityTickSize: new BigNumber(
        market.getMinQuantityTickSize(),
      ).toNumber(),
    }
  }

  static grpcMarketsToMarkets(markets: GrpcSpotMarketInfo[]): SpotMarket[] {
    return markets.map((market) =>
      IndexerGrpcSpotTransformer.grpcMarketToMarket(market),
    )
  }

  static grpcPriceLevelToPriceLevel(priceLevel: GrpcPriceLevel): PriceLevel {
    return {
      price: priceLevel.getPrice(),
      quantity: priceLevel.getQuantity(),
      timestamp: priceLevel.getTimestamp(),
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
      orderHash: order.getOrderHash(),
      orderSide: order.getOrderSide() as SpotOrderSide,
      marketId: order.getMarketId(),
      subaccountId: order.getSubaccountId(),
      price: order.getPrice(),
      state: order.getState() as SpotOrderState,
      quantity: order.getQuantity(),
      unfilledQuantity: order.getUnfilledQuantity(),
      triggerPrice: order.getTriggerPrice(),
      feeRecipient: order.getFeeRecipient(),
      createdAt: order.getCreatedAt(),
      updatedAt: order.getUpdatedAt(),
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
      orderHash: orderHistory.getOrderHash(),
      marketId: orderHistory.getMarketId(),
      active: orderHistory.getIsActive(),
      subaccountId: orderHistory.getSubaccountId(),
      executionType: orderHistory.getExecutionType(),
      orderType: orderHistory.getOrderType(),
      price: orderHistory.getPrice(),
      triggerPrice: orderHistory.getTriggerPrice(),
      quantity: orderHistory.getQuantity(),
      filledQuantity: orderHistory.getFilledQuantity(),
      state: orderHistory.getState(),
      createdAt: orderHistory.getCreatedAt(),
      updatedAt: orderHistory.getUpdatedAt(),
      direction: orderHistory.getDirection()
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
    const price = trade.getPrice()
    const mappedPrice = price
      ? IndexerGrpcSpotTransformer.grpcPriceLevelToPriceLevel(price)
      : zeroPriceLevel()

    return {
      orderHash: trade.getOrderHash(),
      subaccountId: trade.getSubaccountId(),
      marketId: trade.getMarketId(),
      executedAt: trade.getExecutedAt(),
      feeRecipient:
        trade.getFeeRecipient !== undefined ? trade.getFeeRecipient() : '', // TODO: remove the check
      tradeExecutionType: trade.getTradeExecutionType() as TradeExecutionType,
      tradeDirection: trade.getTradeDirection() as TradeDirection,
      fee: trade.getFee(),
      ...mappedPrice,
    }
  }

  static grpcTradesToTrades(trades: GrpcSpotTrade[]): SpotTrade[] {
    return trades.map((trade) =>
      IndexerGrpcSpotTransformer.grpcTradeToTrade(trade),
    )
  }
}
