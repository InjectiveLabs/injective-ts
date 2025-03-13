import {
  OrderSide,
  OrderState,
  TradeDirection,
  TradeExecutionSide,
  TradeExecutionType,
} from '@injectivelabs/ts-types'
import { BigNumber } from '@injectivelabs/utils'
import {
  AtomicSwap,
  SpotTrade,
  SpotMarket,
  GrpcSpotTrade,
  SpotLimitOrder,
  SpotOrderHistory,
  GrpcSpotMarketInfo,
  GrpcSpotLimitOrder,
  GrpcSpotOrderHistory,
  GrpcAtomicSwap,
} from '../types/spot.js'
import {
  Orderbook,
  PriceLevel,
  GrpcTokenMeta,
  GrpcPriceLevel,
  IndexerTokenMeta,
  OrderbookWithSequence,
} from '../types/exchange.js'
import { TokenType } from '../../../types/token.js'
import { grpcPagingToPaging } from '../../../utils/pagination.js'
import { InjectiveSpotExchangeRpc } from '@injectivelabs/indexer-proto-ts'

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
      tokenType: TokenType.Unknown,
    }
  }

  static marketResponseToMarket(
    response: InjectiveSpotExchangeRpc.MarketResponse,
  ) {
    const market = response.market!

    return IndexerGrpcSpotTransformer.grpcMarketToMarket(market)
  }

  static marketsResponseToMarkets(
    response: InjectiveSpotExchangeRpc.MarketsResponse,
  ) {
    const markets = response.markets

    return IndexerGrpcSpotTransformer.grpcMarketsToMarkets(markets)
  }

  static ordersResponseToOrders(
    response: InjectiveSpotExchangeRpc.OrdersResponse,
  ) {
    const orders = response.orders
    const pagination = response.paging

    return {
      orders: IndexerGrpcSpotTransformer.grpcOrdersToOrders(orders),
      pagination: grpcPagingToPaging(pagination),
    }
  }

  static orderHistoryResponseToOrderHistory(
    response: InjectiveSpotExchangeRpc.OrdersHistoryResponse,
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

  static tradesResponseToTrades(
    response: InjectiveSpotExchangeRpc.TradesResponse,
  ) {
    const trades = response.trades
    const pagination = response.paging

    return {
      trades: IndexerGrpcSpotTransformer.grpcTradesToTrades(trades),
      pagination: grpcPagingToPaging(pagination),
    }
  }

  static subaccountTradesListResponseToTradesList(
    response: InjectiveSpotExchangeRpc.SubaccountTradesListResponse,
  ) {
    const tradesList = response.trades

    return IndexerGrpcSpotTransformer.grpcTradesToTrades(tradesList)
  }

  static orderbookV2ResponseToOrderbookV2(
    response: InjectiveSpotExchangeRpc.OrderbookV2Response,
  ) {
    const orderbook = response.orderbook!

    return IndexerGrpcSpotTransformer.grpcOrderbookV2ToOrderbookV2({
      sequence: parseInt(orderbook.sequence, 10),
      buys: orderbook?.buys,
      sells: orderbook?.sells,
    })
  }

  static orderbooksV2ResponseToOrderbooksV2(
    response: InjectiveSpotExchangeRpc.OrderbooksV2Response,
  ) {
    const orderbooks = response.orderbooks!

    return orderbooks.map((o) => {
      const orderbook = o.orderbook!

      return {
        marketId: o.marketId,
        orderbook: IndexerGrpcSpotTransformer.grpcOrderbookV2ToOrderbookV2({
          sequence: parseInt(orderbook.sequence, 10),
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
      minNotional: new BigNumber(market.minNotional).toNumber(),
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

  static grpcOrderbookV2ToOrderbookV2({
    buys,
    sells,
    sequence,
  }: {
    buys: GrpcPriceLevel[]
    sells: GrpcPriceLevel[]
    sequence: number
  }): OrderbookWithSequence {
    return {
      sequence,
      buys: IndexerGrpcSpotTransformer.grpcPriceLevelsToPriceLevels(buys),
      sells: IndexerGrpcSpotTransformer.grpcPriceLevelsToPriceLevels(sells),
    }
  }

  static grpcOrderToOrder(order: GrpcSpotLimitOrder): SpotLimitOrder {
    return {
      orderHash: order.orderHash,
      orderSide: order.orderSide as OrderSide,
      marketId: order.marketId,
      cid: order.cid,
      subaccountId: order.subaccountId,
      price: order.price,
      state: order.state as OrderState,
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
      cid: orderHistory.cid,
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
      cid: trade.cid,
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

  static grpcAtomicSwapHistoryListToAtomicSwapHistoryList(
    response: InjectiveSpotExchangeRpc.AtomicSwapHistoryResponse,
  ) {
    const swapHistory = response.data
    const pagination = response.paging

    return {
      swapHistory: swapHistory.map(
        IndexerGrpcSpotTransformer.grpcAtomicSwapHistoryToAtomicSwapHistory,
      ),
      pagination: grpcPagingToPaging(pagination),
    }
  }

  static grpcAtomicSwapHistoryToAtomicSwapHistory(
    swapHistory: GrpcAtomicSwap,
  ): AtomicSwap {
    return {
      sender: swapHistory.sender,
      route: swapHistory.route,
      sourceCoin: swapHistory.sourceCoin,
      destinationCoin: swapHistory.destCoin,
      fees: swapHistory.fees,
      contractAddress: swapHistory.contractAddress,
      indexBySender: swapHistory.indexBySender,
      indexBySenderContract: swapHistory.indexBySenderContract,
      txHash: swapHistory.txHash,
      executedAt: parseInt(swapHistory.executedAt, 10),
    }
  }
}
