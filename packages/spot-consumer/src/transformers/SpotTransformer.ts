import { TradeDirection, TradeExecutionType } from '@injectivelabs/ts-types'
import { BigNumber } from '@injectivelabs/utils'
import {
  GrpcPriceLevel,
  GrpcSpotMarketInfo,
  GrpcSpotLimitOrder,
  GrpcSpotTrade,
  Orderbook,
  PriceLevel,
  SpotMarket,
  SpotLimitOrder,
  SpotTrade,
  GrpcTokenMeta,
  TokenMeta,
  SpotOrderState,
  SpotOrderSide,
} from '../types'

const zeroPriceLevel = () => ({
  price: '0',
  quantity: '0',
  timestamp: 0,
})

export class SpotTransformer {
  static grpcTokenMetaToTokenMeta(
    tokenMeta: GrpcTokenMeta | undefined,
  ): TokenMeta | undefined {
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
    }
  }

  static grpcMarketToMarket(market: GrpcSpotMarketInfo): SpotMarket {
    return {
      marketId: market.getMarketId(),
      marketStatus: market.getMarketStatus(),
      ticker: market.getTicker(),
      baseDenom: market.getBaseDenom(),
      quoteDenom: market.getQuoteDenom(),
      quoteToken: SpotTransformer.grpcTokenMetaToTokenMeta(
        market.getQuoteTokenMeta(),
      ),
      baseToken: SpotTransformer.grpcTokenMetaToTokenMeta(
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
    return markets.map((market) => SpotTransformer.grpcMarketToMarket(market))
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
      SpotTransformer.grpcPriceLevelToPriceLevel(priceLevel),
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
      buys: SpotTransformer.grpcPriceLevelsToPriceLevels(buys),
      sells: SpotTransformer.grpcPriceLevelsToPriceLevels(sells),
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
    return orders.map((order) => SpotTransformer.grpcOrderToOrder(order))
  }

  static grpcTradeToTrade(trade: GrpcSpotTrade): SpotTrade {
    const price = trade.getPrice()
    const mappedPrice = price
      ? SpotTransformer.grpcPriceLevelToPriceLevel(price)
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
    return trades.map((trade) => SpotTransformer.grpcTradeToTrade(trade))
  }
}
