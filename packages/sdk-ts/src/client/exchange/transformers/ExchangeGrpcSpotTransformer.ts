import { TradeDirection, TradeExecutionType } from '@injectivelabs/ts-types'
import { BigNumber } from '@injectivelabs/utils'
import {
  SpotOrderSide,
  SpotOrderState,
  GrpcSpotMarketInfo,
  GrpcSpotLimitOrder,
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
  ExchangeTokenMeta,
} from '../types/exchange'
import {
  MarketsResponse as SpotMarketsResponse,
  MarketResponse as SpotMarketResponse,
  OrderbookResponse as SpotOrderbookResponse,
  OrdersResponse as SpotOrdersResponse,
  TradesResponse as SpotTradesResponse,
  OrderbooksResponse as SpotOrderbooksResponse,
  SubaccountTradesListResponse as SpotSubaccountTradesListResponse,
} from '@injectivelabs/exchange-api/injective_spot_exchange_rpc_pb'

const zeroPriceLevel = () => ({
  price: '0',
  quantity: '0',
  timestamp: 0,
})

/**
 * @category Exchange Grpc Transformer
 */
export class ExchangeGrpcSpotTransformer {
  static grpcTokenMetaToTokenMeta(
    tokenMeta: GrpcTokenMeta | undefined,
  ): ExchangeTokenMeta | undefined {
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

    return ExchangeGrpcSpotTransformer.grpcMarketToMarket(market)
  }

  static marketsResponseToMarkets(response: SpotMarketsResponse) {
    const markets = response.getMarketsList()

    return ExchangeGrpcSpotTransformer.grpcMarketsToMarkets(markets)
  }

  static ordersResponseToOrders(response: SpotOrdersResponse) {
    const orders = response.getOrdersList()

    return ExchangeGrpcSpotTransformer.grpcOrdersToOrders(orders)
  }

  static tradesResponseToTrades(response: SpotTradesResponse) {
    const trades = response.getTradesList()

    return ExchangeGrpcSpotTransformer.grpcTradesToTrades(trades)
  }

  static subaccountTradesListResponseToTrades(
    response: SpotSubaccountTradesListResponse,
  ) {
    const trades = response.getTradesList()

    return ExchangeGrpcSpotTransformer.grpcTradesToTrades(trades)
  }

  static orderbookResponseToOrderbook(response: SpotOrderbookResponse) {
    const orderbook = response.getOrderbook()!

    return ExchangeGrpcSpotTransformer.grpcOrderbookToOrderbook({
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
        orderbook: ExchangeGrpcSpotTransformer.grpcOrderbookToOrderbook({
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
      quoteToken: ExchangeGrpcSpotTransformer.grpcTokenMetaToTokenMeta(
        market.getQuoteTokenMeta(),
      ),
      baseToken: ExchangeGrpcSpotTransformer.grpcTokenMetaToTokenMeta(
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
      ExchangeGrpcSpotTransformer.grpcMarketToMarket(market),
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
      ExchangeGrpcSpotTransformer.grpcPriceLevelToPriceLevel(priceLevel),
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
      buys: ExchangeGrpcSpotTransformer.grpcPriceLevelsToPriceLevels(buys),
      sells: ExchangeGrpcSpotTransformer.grpcPriceLevelsToPriceLevels(sells),
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
    }
  }

  static grpcOrdersToOrders(orders: GrpcSpotLimitOrder[]): SpotLimitOrder[] {
    return orders.map((order) =>
      ExchangeGrpcSpotTransformer.grpcOrderToOrder(order),
    )
  }

  static grpcTradeToTrade(trade: GrpcSpotTrade): SpotTrade {
    const price = trade.getPrice()
    const mappedPrice = price
      ? ExchangeGrpcSpotTransformer.grpcPriceLevelToPriceLevel(price)
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
      ExchangeGrpcSpotTransformer.grpcTradeToTrade(trade),
    )
  }
}
