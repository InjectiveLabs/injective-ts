import { BigNumber } from '@injectivelabs/utils'
import { TokenType } from '../../../types/token.js'
import { grpcPagingToPagingV2 } from '../../../utils/pagination.js'
import type { InjectiveExplorerRpcPb } from '@injectivelabs/indexer-proto-ts-v2'
import type * as InjectiveSpotExchangeRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_spot_exchange_rpc_pb'
import type {
  OrderSide,
  OrderState,
  TradeDirection,
  TradeExecutionSide,
  TradeExecutionType,
} from '@injectivelabs/ts-types'
import type {
  Orderbook,
  PriceLevel,
  GrpcTokenMeta,
  GrpcPriceLevel,
  IndexerTokenMeta,
  OrderbookWithSequence,
} from '../types/exchange.js'
import type {
  SpotTrade,
  AtomicSwap,
  SpotMarket,
  GrpcSpotTrade,
  SpotLimitOrder,
  GrpcAtomicSwap,
  SpotOrderHistory,
  GrpcSpotMarketInfo,
  GrpcSpotLimitOrder,
  GrpcSpotOrderHistory,
} from '../types/spot.js'

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
      updatedAt: Number(tokenMeta.updatedAt),
      coinGeckoId: '',
      tokenType: TokenType.Unknown,
    }
  }

  static marketResponseToMarket(
    response: InjectiveSpotExchangeRpcPb.MarketResponse,
  ) {
    const market = response.market!

    return IndexerGrpcSpotTransformer.grpcMarketToMarket(market)
  }

  static marketsResponseToMarkets(
    response: InjectiveSpotExchangeRpcPb.MarketsResponse,
  ) {
    const markets = response.markets

    return IndexerGrpcSpotTransformer.grpcMarketsToMarkets(markets)
  }

  static ordersResponseToOrders(
    response: InjectiveSpotExchangeRpcPb.OrdersResponse,
  ) {
    const orders = response.orders
    const pagination = response.paging

    return {
      orders: IndexerGrpcSpotTransformer.grpcOrdersToOrders(orders),
      pagination: grpcPagingToPagingV2(
        pagination as InjectiveExplorerRpcPb.Paging,
      ),
    }
  }

  static orderHistoryResponseToOrderHistory(
    response: InjectiveSpotExchangeRpcPb.OrdersHistoryResponse,
  ) {
    const orderHistory = response.orders
    const pagination = response.paging

    return {
      orderHistory:
        IndexerGrpcSpotTransformer.grpcOrderHistoryListToOrderHistoryList(
          orderHistory,
        ),
      pagination: grpcPagingToPagingV2(
        pagination as InjectiveExplorerRpcPb.Paging,
      ),
    }
  }

  static tradesResponseToTrades(
    response: InjectiveSpotExchangeRpcPb.TradesResponse,
  ) {
    const trades = response.trades
    const pagination = response.paging

    return {
      trades: IndexerGrpcSpotTransformer.grpcTradesToTrades(trades),
      pagination: grpcPagingToPagingV2(
        pagination as InjectiveExplorerRpcPb.Paging,
      ),
    }
  }

  static subaccountTradesListResponseToTradesList(
    response: InjectiveSpotExchangeRpcPb.SubaccountTradesListResponse,
  ) {
    const tradesList = response.trades

    return IndexerGrpcSpotTransformer.grpcTradesToTrades(tradesList)
  }

  static orderbookV2ResponseToOrderbookV2(
    response: InjectiveSpotExchangeRpcPb.OrderbookV2Response,
  ) {
    const orderbook = response.orderbook!

    return IndexerGrpcSpotTransformer.grpcOrderbookV2ToOrderbookV2({
      sequence: Number(orderbook.sequence),
      buys: orderbook?.buys,
      sells: orderbook?.sells,
    })
  }

  static orderbooksV2ResponseToOrderbooksV2(
    response: InjectiveSpotExchangeRpcPb.OrderbooksV2Response,
  ) {
    const orderbooks = response.orderbooks!

    return orderbooks.map((o) => {
      const orderbook = o.orderbook!

      return {
        marketId: o.marketId,
        orderbook: IndexerGrpcSpotTransformer.grpcOrderbookV2ToOrderbookV2({
          sequence: Number(orderbook.sequence),
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
      timestamp: Number(priceLevel.timestamp),
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
      createdAt: Number(order.createdAt),
      updatedAt: Number(order.updatedAt),
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
      createdAt: Number(orderHistory.createdAt),
      updatedAt: Number(orderHistory.updatedAt),
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
      ? {
          price: price.price,
          quantity: price.quantity,
          timestamp: Number(price.timestamp),
        }
      : zeroPriceLevel()

    return {
      orderHash: trade.orderHash,
      subaccountId: trade.subaccountId,
      marketId: trade.marketId,
      tradeId: trade.tradeId,
      cid: trade.cid,
      executedAt: Number(trade.executedAt),
      feeRecipient: trade.feeRecipient,
      tradeExecutionType: trade.tradeExecutionType as TradeExecutionType,
      executionSide: trade.executionSide as TradeExecutionSide,
      tradeDirection: trade.tradeDirection as TradeDirection,
      fee: trade.fee,
      price: mappedPrice.price,
      quantity: mappedPrice.quantity,
      timestamp: mappedPrice.timestamp,
    }
  }

  static grpcTradesToTrades(trades: GrpcSpotTrade[]): SpotTrade[] {
    return trades.map((trade) =>
      IndexerGrpcSpotTransformer.grpcTradeToTrade(trade),
    )
  }

  static grpcAtomicSwapHistoryListToAtomicSwapHistoryList(
    response: InjectiveSpotExchangeRpcPb.AtomicSwapHistoryResponse,
  ) {
    const swapHistory = response.data
    const pagination = response.paging

    return {
      swapHistory: swapHistory.map(
        IndexerGrpcSpotTransformer.grpcAtomicSwapHistoryToAtomicSwapHistory,
      ),
      pagination: grpcPagingToPagingV2(
        pagination as InjectiveExplorerRpcPb.Paging,
      ),
    }
  }

  static grpcAtomicSwapHistoryToAtomicSwapHistory(
    swapHistory: GrpcAtomicSwap,
  ): AtomicSwap {
    return {
      sender: swapHistory.sender,
      route: swapHistory.route,
      sourceCoin: swapHistory.sourceCoin || undefined,
      destinationCoin: swapHistory.destCoin || undefined,
      fees: swapHistory.fees,
      contractAddress: swapHistory.contractAddress,
      indexBySender: swapHistory.indexBySender,
      indexBySenderContract: swapHistory.indexBySenderContract,
      txHash: swapHistory.txHash,
      executedAt: Number(swapHistory.executedAt),
    }
  }
}
