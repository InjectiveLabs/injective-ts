import { TradeDirection, TradeExecutionType } from '@injectivelabs/ts-types'
import { BigNumber } from '@injectivelabs/utils'
import {
  DerivativeOrderSide,
  DerivativeOrderState,
  GrpcDerivativeMarketInfo,
  GrpcDerivativeLimitOrder,
  GrpcDerivativeTrade,
  DerivativeMarket,
  DerivativeLimitOrder,
  DerivativeTrade,
  PositionDelta,
  GrpcDerivativePosition,
  Position,
  GrpcPositionDelta,
  PerpetualMarketInfo,
  GrpcPerpetualMarketInfo,
  GrpcPerpetualMarketFunding,
  PerpetualMarketFunding,
  GrpcExpiryFuturesMarketInfo,
  GrpcFundingPayment,
  GrpcFundingRate,
  FundingPayment,
  FundingRate,
  ExpiryFuturesMarketInfo,
  GrpcBinaryOptionsMarketInfo,
  BinaryOptionsMarket,
} from '../types/derivatives'
import {
  GrpcPriceLevel,
  Orderbook,
  PriceLevel,
  GrpcTokenMeta,
  ExchangeTokenMeta,
} from '../types/exchange'
import {
  FundingPaymentsResponse,
  FundingRatesResponse,
  MarketsResponse as DerivativeMarketsResponse,
  MarketResponse as DerivativeMarketResponse,
  OrderbookResponse as DerivativeOrderbookResponse,
  OrdersResponse as DerivativeOrdersResponse,
  TradesResponse as DerivativeTradesResponse,
  PositionsResponse as DerivativePositionsResponse,
  OrderbooksResponse as DerivativeOrderbooksResponse,
  SubaccountTradesListResponse as DerivativeSubaccountTradesListResponse,
} from '@injectivelabs/exchange-api/injective_derivative_exchange_rpc_pb'
import {
  BinaryOptionsMarketsResponse as BinaryOptionsMarketsResponse,
  BinaryOptionsMarketResponse as BinaryOptionsMarketResponse,
} from '@injectivelabs/exchange-api/injective_derivative_exchange_rpc_pb'

const zeroPositionDelta = () => ({
  tradeDirection: TradeDirection.Buy,
  executionPrice: '0',
  executionQuantity: '0',
  executionMargin: '0',
})

/**
 * @category Exchange Grpc Transformer
 */
export class ExchangeGrpcDerivativeTransformer {
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

  static grpcPerpetualMarketInfoToPerpetualMarketInfo(
    perpetualMarketInfo: GrpcPerpetualMarketInfo | undefined,
  ): PerpetualMarketInfo | undefined {
    if (!perpetualMarketInfo) {
      return
    }

    return {
      hourlyFundingRateCap: perpetualMarketInfo.getHourlyFundingRateCap(),
      hourlyInterestRate: perpetualMarketInfo.getHourlyInterestRate(),
      nextFundingTimestamp: perpetualMarketInfo.getNextFundingTimestamp(),
      fundingInterval: perpetualMarketInfo.getFundingInterval(),
    }
  }

  static grpcPerpetualMarketFundingToPerpetualMarketFunding(
    perpetualMarketFunding: GrpcPerpetualMarketFunding | undefined,
  ): PerpetualMarketFunding | undefined {
    if (!perpetualMarketFunding) {
      return
    }

    return {
      cumulativeFunding: perpetualMarketFunding.getCumulativeFunding(),
      cumulativePrice: perpetualMarketFunding.getCumulativePrice(),
      lastTimestamp: perpetualMarketFunding.getLastTimestamp(),
    }
  }

  static grpcExpiryFuturesMarketInfoToExpiryFuturesMarketInfo(
    expiryFuturesMarketInfo: GrpcExpiryFuturesMarketInfo | undefined,
  ): ExpiryFuturesMarketInfo | undefined {
    if (!expiryFuturesMarketInfo) {
      return
    }

    return {
      expirationTimestamp: expiryFuturesMarketInfo.getExpirationTimestamp(),
      settlementPrice: expiryFuturesMarketInfo.getSettlementPrice(),
    }
  }

  static marketResponseToMarket(response: DerivativeMarketResponse) {
    const market = response.getMarket()!

    return ExchangeGrpcDerivativeTransformer.grpcMarketToMarket(market)
  }

  static marketsResponseToMarkets(response: DerivativeMarketsResponse) {
    const markets = response.getMarketsList()

    return ExchangeGrpcDerivativeTransformer.grpcMarketsToMarkets(markets)
  }

  static ordersResponseToOrders(response: DerivativeOrdersResponse) {
    const orders = response.getOrdersList()

    return ExchangeGrpcDerivativeTransformer.grpcOrdersToOrders(orders)
  }

  static positionsResponseToPositions(response: DerivativePositionsResponse) {
    const positions = response.getPositionsList()

    return ExchangeGrpcDerivativeTransformer.grpcPositionsToPositions(positions)
  }

  static tradesResponseToTrades(response: DerivativeTradesResponse) {
    const trades = response.getTradesList()

    return ExchangeGrpcDerivativeTransformer.grpcTradesToTrades(trades)
  }

  static subaccountTradesListResponseToTrades(
    response: DerivativeSubaccountTradesListResponse,
  ) {
    const trades = response.getTradesList()

    return ExchangeGrpcDerivativeTransformer.grpcTradesToTrades(trades)
  }

  static fundingPaymentsResponseToFundingPayments(
    response: FundingPaymentsResponse,
  ) {
    const fundingPayments = response.getPaymentsList()

    return ExchangeGrpcDerivativeTransformer.grpcFundingPaymentsToFundingPayments(
      fundingPayments,
    )
  }

  static fundingRatesResponseToFundingRates(response: FundingRatesResponse) {
    const fundingRates = response.getFundingRatesList()

    return ExchangeGrpcDerivativeTransformer.grpcFundingRatesToFundingRates(
      fundingRates,
    )
  }

  static orderbookResponseToOrderbook(response: DerivativeOrderbookResponse) {
    const orderbook = response.getOrderbook()!

    return ExchangeGrpcDerivativeTransformer.grpcOrderbookToOrderbook({
      buys: orderbook?.getBuysList(),
      sells: orderbook?.getSellsList(),
    })
  }

  static orderbooksResponseToOrderbooks(
    response: DerivativeOrderbooksResponse,
  ) {
    const orderbooks = response.getOrderbooksList()!

    return orderbooks.map((o) => {
      const orderbook = o.getOrderbook()!

      return {
        marketId: o.getMarketId(),
        orderbook: ExchangeGrpcDerivativeTransformer.grpcOrderbookToOrderbook({
          buys: orderbook.getBuysList(),
          sells: orderbook.getSellsList(),
        }),
      }
    })
  }

  static binaryOptionsMarketResponseToBinaryOptionsMarket(
    response: BinaryOptionsMarketResponse,
  ) {
    const market = response.getMarket()!

    return ExchangeGrpcDerivativeTransformer.grpcBinaryOptionsMarketToBinaryOptionsMarket(
      market,
    )
  }

  static binaryOptionsMarketsResponseToBinaryOptionsMarkets(
    response: BinaryOptionsMarketsResponse,
  ) {
    const markets = response.getMarketsList()

    return ExchangeGrpcDerivativeTransformer.grpcBinaryOptionsMarketsToBinaryOptionsMarkets(
      markets,
    )
  }

  static grpcBinaryOptionsMarketToBinaryOptionsMarket(
    market: GrpcBinaryOptionsMarketInfo,
  ): BinaryOptionsMarket {
    return {
      marketId: market.getMarketId(),
      marketStatus: market.getMarketStatus(),
      ticker: market.getTicker(),
      oracleSymbol: market.getOracleSymbol(),
      oracleProvider: market.getOracleProvider(),
      oracleType: market.getOracleType(),
      oracleScaleFactor: market.getOracleScaleFactor(),
      expirationTimestamp: market.getExpirationTimestamp(),
      settlementTimestamp: market.getSettlementTimestamp(),
      quoteDenom: market.getQuoteDenom(),
      quoteToken: ExchangeGrpcDerivativeTransformer.grpcTokenMetaToTokenMeta(
        market.getQuoteTokenMeta(),
      ),
      makerFeeRate: market.getMakerFeeRate(),
      takerFeeRate: market.getTakerFeeRate(),
      serviceProviderFee: market.getServiceProviderFee(),
      minPriceTickSize: market.getMinPriceTickSize(),
      minQuantityTickSize: market.getMinQuantityTickSize(),
      settlementPrice: market.getSettlementPrice(),
    }
  }

  static grpcBinaryOptionsMarketsToBinaryOptionsMarkets(
    markets: GrpcBinaryOptionsMarketInfo[],
  ): BinaryOptionsMarket[] {
    return markets.map(
      ExchangeGrpcDerivativeTransformer.grpcBinaryOptionsMarketToBinaryOptionsMarket,
    )
  }

  static grpcMarketToMarket(
    market: GrpcDerivativeMarketInfo,
  ): DerivativeMarket {
    return {
      oracleBase: market.getOracleBase(),
      oracleQuote: market.getOracleQuote(),
      oracleType: market.getOracleType(),
      initialMarginRatio: market.getInitialMarginRatio(),
      maintenanceMarginRatio: market.getMaintenanceMarginRatio(),
      isPerpetual: market.getIsPerpetual(),
      marketId: market.getMarketId(),
      marketStatus: market.getMarketStatus(),
      ticker: market.getTicker(),
      quoteDenom: market.getQuoteDenom(),
      quoteToken: ExchangeGrpcDerivativeTransformer.grpcTokenMetaToTokenMeta(
        market.getQuoteTokenMeta(),
      ),
      makerFeeRate: market.getMakerFeeRate(),
      takerFeeRate: market.getTakerFeeRate(),
      serviceProviderFee: market.getServiceProviderFee(),
      minPriceTickSize: new BigNumber(market.getMinPriceTickSize()).toNumber(),
      minQuantityTickSize: new BigNumber(
        market.getMinQuantityTickSize(),
      ).toNumber(),
      perpetualMarketInfo:
        ExchangeGrpcDerivativeTransformer.grpcPerpetualMarketInfoToPerpetualMarketInfo(
          market.getPerpetualMarketInfo(),
        ),
      perpetualMarketFunding:
        ExchangeGrpcDerivativeTransformer.grpcPerpetualMarketFundingToPerpetualMarketFunding(
          market.getPerpetualMarketFunding(),
        ),
      expiryFuturesMarketInfo:
        ExchangeGrpcDerivativeTransformer.grpcExpiryFuturesMarketInfoToExpiryFuturesMarketInfo(
          market.getExpiryFuturesMarketInfo(),
        ),
    }
  }

  static grpcMarketsToMarkets(
    markets: GrpcDerivativeMarketInfo[],
  ): DerivativeMarket[] {
    return markets.map((market) =>
      ExchangeGrpcDerivativeTransformer.grpcMarketToMarket(market),
    )
  }

  static grpcPositionDeltaToPositionDelta(
    positionDelta: GrpcPositionDelta,
  ): PositionDelta {
    return {
      tradeDirection: positionDelta.getTradeDirection() as TradeDirection,
      executionPrice: positionDelta.getExecutionPrice(),
      executionQuantity: positionDelta.getExecutionQuantity(),
      executionMargin: positionDelta.getExecutionMargin(),
    }
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
      ExchangeGrpcDerivativeTransformer.grpcPriceLevelToPriceLevel(priceLevel),
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
      buys: ExchangeGrpcDerivativeTransformer.grpcPriceLevelsToPriceLevels(
        buys,
      ),
      sells:
        ExchangeGrpcDerivativeTransformer.grpcPriceLevelsToPriceLevels(sells),
    }
  }

  static grpcOrderToOrder(
    order: GrpcDerivativeLimitOrder,
  ): DerivativeLimitOrder {
    return {
      orderHash: order.getOrderHash(),
      orderSide: order.getOrderSide() as DerivativeOrderSide,
      marketId: order.getMarketId(),
      subaccountId: order.getSubaccountId(),
      isReduceOnly: order.getIsReduceOnly(),
      margin: order.getMargin(),
      price: order.getPrice(),
      quantity: order.getQuantity(),
      unfilledQuantity: order.getUnfilledQuantity(),
      triggerPrice: order.getTriggerPrice(),
      feeRecipient: order.getFeeRecipient(),
      state: order.getState() as DerivativeOrderState,
    }
  }

  static grpcOrdersToOrders(
    orders: GrpcDerivativeLimitOrder[],
  ): DerivativeLimitOrder[] {
    return orders.map((order) =>
      ExchangeGrpcDerivativeTransformer.grpcOrderToOrder(order),
    )
  }

  static grpcPositionToPosition(position: GrpcDerivativePosition): Position {
    return {
      marketId: position.getMarketId(),
      subaccountId: position.getSubaccountId(),
      direction: position.getDirection() as TradeDirection,
      quantity: position.getQuantity(),
      entryPrice: position.getEntryPrice(),
      margin: position.getMargin(),
      aggregateReduceOnlyQuantity: position.getAggregateReduceOnlyQuantity(),
      liquidationPrice: position.getLiquidationPrice(),
      markPrice: position.getMarkPrice(),
      ticker: position.getTicker(),
    }
  }

  static grpcPositionsToPositions(
    positions: GrpcDerivativePosition[],
  ): Position[] {
    return positions.map((position) =>
      ExchangeGrpcDerivativeTransformer.grpcPositionToPosition(position),
    )
  }

  static grpcTradeToTrade(trade: GrpcDerivativeTrade): DerivativeTrade {
    const positionDelta = trade.getPositionDelta()
    const mappedPositionDelta = positionDelta
      ? ExchangeGrpcDerivativeTransformer.grpcPositionDeltaToPositionDelta(
          positionDelta,
        )
      : zeroPositionDelta()

    return {
      orderHash: trade.getOrderHash(),
      subaccountId: trade.getSubaccountId(),
      marketId: trade.getMarketId(),
      executedAt: trade.getExecutedAt(),
      tradeExecutionType: trade.getTradeExecutionType() as TradeExecutionType,
      fee: trade.getFee(),
      feeRecipient:
        trade.getFeeRecipient !== undefined ? trade.getFeeRecipient() : '', // TODO: remove the check
      isLiquidation: trade.getIsLiquidation(),
      payout: trade.getPayout(),
      ...mappedPositionDelta,
    }
  }

  static grpcTradesToTrades(trades: GrpcDerivativeTrade[]): DerivativeTrade[] {
    return trades.map((trade) =>
      ExchangeGrpcDerivativeTransformer.grpcTradeToTrade(trade),
    )
  }

  static grpcFundingPaymentToFundingPayment(
    fundingPayment: GrpcFundingPayment,
  ): FundingPayment {
    return {
      marketId: fundingPayment.getMarketId(),
      subaccountId: fundingPayment.getSubaccountId(),
      amount: fundingPayment.getAmount(),
      timestamp: fundingPayment.getTimestamp(),
    }
  }

  static grpcFundingPaymentsToFundingPayments(
    fundingPayments: GrpcFundingPayment[],
  ): FundingPayment[] {
    return fundingPayments.map(
      ExchangeGrpcDerivativeTransformer.grpcFundingPaymentToFundingPayment,
    )
  }

  static grpcFundingRateToFundingRate(
    fundingRate: GrpcFundingRate,
  ): FundingRate {
    return {
      marketId: fundingRate.getMarketId(),
      rate: fundingRate.getRate(),
      timestamp: fundingRate.getTimestamp(),
    }
  }

  static grpcFundingRatesToFundingRates(
    fundingRates: GrpcFundingRate[],
  ): FundingRate[] {
    return fundingRates.map(
      ExchangeGrpcDerivativeTransformer.grpcFundingRateToFundingRate,
    )
  }
}
