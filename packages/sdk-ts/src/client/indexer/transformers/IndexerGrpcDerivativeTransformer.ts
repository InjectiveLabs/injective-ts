import { BigNumber } from '@injectivelabs/utils'
import {
  TokenType,
  OrderState,
  TradeDirection,
  type OrderSide,
  type TradeExecutionSide,
  type TradeExecutionType,
} from '../../../types/index.js'
import type * as InjectiveDerivativeExchangeRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_derivative_exchange_rpc_pb'
import type {
  Orderbook,
  PriceLevel,
  GrpcTokenMeta,
  GrpcPriceLevel,
  IndexerTokenMeta,
  OrderbookWithSequence,
} from '../types/exchange.js'
import type {
  Position,
  PositionV2,
  FundingRate,
  PositionDelta,
  FundingPayment,
  DerivativeTrade,
  GrpcFundingRate,
  DerivativeMarket,
  GrpcPositionDelta,
  GrpcFundingPayment,
  GrpcDerivativeTrade,
  PerpetualMarketInfo,
  BinaryOptionsMarket,
  DerivativeLimitOrder,
  GrpcDerivativePosition,
  PerpetualMarketFunding,
  DerivativeOrderHistory,
  GrpcPerpetualMarketInfo,
  ExpiryFuturesMarketInfo,
  GrpcDerivativeMarketInfo,
  GrpcDerivativeLimitOrder,
  GrpcDerivativePositionV2,
  GrpcPerpetualMarketFunding,
  GrpcDerivativeOrderHistory,
  GrpcExpiryFuturesMarketInfo,
  GrpcBinaryOptionsMarketInfo,
} from '../types/derivatives.js'

const zeroPositionDelta = () => ({
  tradeDirection: TradeDirection.Buy,
  executionPrice: '0',
  executionQuantity: '0',
  executionMargin: '0',
})

/**
 * @category Indexer Grpc Transformer
 */
export class IndexerGrpcDerivativeTransformer {
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

  static grpcPerpetualMarketInfoToPerpetualMarketInfo(
    perpetualMarketInfo: GrpcPerpetualMarketInfo | undefined,
  ): PerpetualMarketInfo | undefined {
    if (!perpetualMarketInfo) {
      return
    }

    return {
      hourlyFundingRateCap: perpetualMarketInfo.hourlyFundingRateCap,
      hourlyInterestRate: perpetualMarketInfo.hourlyInterestRate,
      nextFundingTimestamp: Number(perpetualMarketInfo.nextFundingTimestamp),
      fundingInterval: Number(perpetualMarketInfo.fundingInterval),
    }
  }

  static grpcPerpetualMarketFundingToPerpetualMarketFunding(
    perpetualMarketFunding: GrpcPerpetualMarketFunding | undefined,
  ): PerpetualMarketFunding | undefined {
    if (!perpetualMarketFunding) {
      return
    }

    return {
      cumulativeFunding: perpetualMarketFunding.cumulativeFunding,
      cumulativePrice: perpetualMarketFunding.cumulativePrice,
      lastTimestamp: Number(perpetualMarketFunding.lastTimestamp),
    }
  }

  static grpcExpiryFuturesMarketInfoToExpiryFuturesMarketInfo(
    expiryFuturesMarketInfo: GrpcExpiryFuturesMarketInfo | undefined,
  ): ExpiryFuturesMarketInfo | undefined {
    if (!expiryFuturesMarketInfo) {
      return
    }

    return {
      expirationTimestamp: Number(expiryFuturesMarketInfo.expirationTimestamp),
      settlementPrice: expiryFuturesMarketInfo.settlementPrice,
    }
  }

  static marketResponseToMarket(
    response: InjectiveDerivativeExchangeRpcPb.MarketResponse,
  ) {
    const market = response.market!

    return IndexerGrpcDerivativeTransformer.grpcMarketToMarket(market)
  }

  static marketsResponseToMarkets(
    response: InjectiveDerivativeExchangeRpcPb.MarketsResponse,
  ) {
    const markets = response.markets

    return IndexerGrpcDerivativeTransformer.grpcMarketsToMarkets(markets)
  }

  static ordersResponseToOrders(
    response: InjectiveDerivativeExchangeRpcPb.OrdersResponse,
  ) {
    const orders = response.orders
    const pagination = response.paging

    return {
      orders: IndexerGrpcDerivativeTransformer.grpcOrdersToOrders(orders),
      pagination: pagination
        ? {
            to: pagination.to,
            from: pagination.from,
            total: Number(pagination.total),
            countBySubaccount: pagination.countBySubaccount,
            next: pagination.next,
          }
        : undefined,
    }
  }

  static orderHistoryResponseToOrderHistory(
    response: InjectiveDerivativeExchangeRpcPb.OrdersHistoryResponse,
    isConditional?: boolean,
  ) {
    const orderHistory = response.orders
    const pagination = response.paging

    return {
      orderHistory:
        IndexerGrpcDerivativeTransformer.grpcOrderHistoryListToOrderHistoryList(
          orderHistory,
          isConditional,
        ),
      pagination: pagination
        ? {
            to: pagination.to,
            from: pagination.from,
            total: Number(pagination.total),
            countBySubaccount: pagination.countBySubaccount,
            next: pagination.next,
          }
        : undefined,
    }
  }

  static positionsResponseToPositions(
    response: InjectiveDerivativeExchangeRpcPb.PositionsResponse,
  ) {
    const positions = response.positions
    const pagination = response.paging

    return {
      positions:
        IndexerGrpcDerivativeTransformer.grpcPositionsToPositions(positions),
      pagination: pagination
        ? {
            to: pagination.to,
            from: pagination.from,
            total: Number(pagination.total),
            countBySubaccount: pagination.countBySubaccount,
            next: pagination.next,
          }
        : undefined,
    }
  }

  static positionsV2ResponseToPositionsV2(
    response: InjectiveDerivativeExchangeRpcPb.PositionsV2Response,
  ) {
    const positions = response.positions
    const pagination = response.paging

    return {
      positions:
        IndexerGrpcDerivativeTransformer.grpcPositionsV2ToPositionsV2(
          positions,
        ),
      pagination: pagination
        ? {
            to: pagination.to,
            from: pagination.from,
            total: Number(pagination.total),
            countBySubaccount: pagination.countBySubaccount,
            next: pagination.next,
          }
        : undefined,
    }
  }

  static tradesResponseToTrades(
    response: InjectiveDerivativeExchangeRpcPb.TradesResponse,
  ) {
    const trades = response.trades
    const pagination = response.paging

    return {
      trades: IndexerGrpcDerivativeTransformer.grpcTradesToTrades(trades),
      pagination: pagination
        ? {
            to: pagination.to,
            from: pagination.from,
            total: Number(pagination.total),
            countBySubaccount: pagination.countBySubaccount,
            next: pagination.next,
          }
        : undefined,
    }
  }

  static subaccountTradesListResponseToSubaccountTradesList(
    response: InjectiveDerivativeExchangeRpcPb.SubaccountTradesListResponse,
  ) {
    const tradesList = response.trades

    return IndexerGrpcDerivativeTransformer.grpcTradesToTrades(tradesList)
  }

  static fundingPaymentsResponseToFundingPayments(
    response: InjectiveDerivativeExchangeRpcPb.FundingPaymentsResponse,
  ) {
    const fundingPayments = response.payments
    const pagination = response.paging

    return {
      fundingPayments:
        IndexerGrpcDerivativeTransformer.grpcFundingPaymentsToFundingPayments(
          fundingPayments,
        ),
      pagination: pagination
        ? {
            to: pagination.to,
            from: pagination.from,
            total: Number(pagination.total),
            countBySubaccount: pagination.countBySubaccount,
            next: pagination.next,
          }
        : undefined,
    }
  }

  static fundingRatesResponseToFundingRates(
    response: InjectiveDerivativeExchangeRpcPb.FundingRatesResponse,
  ) {
    const fundingRates = response.fundingRates
    const pagination = response.paging

    return {
      fundingRates:
        IndexerGrpcDerivativeTransformer.grpcFundingRatesToFundingRates(
          fundingRates,
        ),
      pagination: pagination
        ? {
            to: pagination.to,
            from: pagination.from,
            total: Number(pagination.total),
            countBySubaccount: pagination.countBySubaccount,
            next: pagination.next,
          }
        : undefined,
    }
  }

  static orderbookV2ResponseToOrderbookV2(
    response: InjectiveDerivativeExchangeRpcPb.OrderbookV2Response,
  ) {
    const orderbook = response.orderbook!

    return IndexerGrpcDerivativeTransformer.grpcOrderbookV2ToOrderbookV2({
      sequence: Number(orderbook.sequence),
      buys: orderbook?.buys || [],
      sells: orderbook?.sells || [],
    })
  }

  static orderbooksV2ResponseToOrderbooksV2(
    response: InjectiveDerivativeExchangeRpcPb.OrderbooksV2Response,
  ) {
    const orderbooks = response.orderbooks!

    return orderbooks.map((o) => {
      const orderbook = o.orderbook!

      return {
        marketId: o.marketId,
        orderbook:
          IndexerGrpcDerivativeTransformer.grpcOrderbookV2ToOrderbookV2({
            sequence: Number(orderbook.sequence),
            buys: orderbook.buys || [],
            sells: orderbook.sells || [],
          }),
      }
    })
  }

  static binaryOptionsMarketResponseToBinaryOptionsMarket(
    response: InjectiveDerivativeExchangeRpcPb.BinaryOptionsMarketResponse,
  ) {
    const market = response.market!

    return IndexerGrpcDerivativeTransformer.grpcBinaryOptionsMarketToBinaryOptionsMarket(
      market,
    )
  }

  static binaryOptionsMarketResponseWithPaginationToBinaryOptionsMarket(
    response: InjectiveDerivativeExchangeRpcPb.BinaryOptionsMarketsResponse,
  ) {
    const markets = response.markets
    const pagination = response.paging

    return {
      markets:
        IndexerGrpcDerivativeTransformer.grpcBinaryOptionsMarketsToBinaryOptionsMarkets(
          markets,
        ),
      pagination: {
        to: pagination?.to || 0,
        from: pagination?.from || 0,
        total: Number(pagination?.total || 0),
        countBySubaccount: Number(pagination?.countBySubaccount || 0),
        next: pagination?.next || [],
      },
    }
  }

  static binaryOptionsMarketsResponseToBinaryOptionsMarkets(
    response: InjectiveDerivativeExchangeRpcPb.BinaryOptionsMarketsResponse,
  ) {
    const markets = response.markets

    return IndexerGrpcDerivativeTransformer.grpcBinaryOptionsMarketsToBinaryOptionsMarkets(
      markets,
    )
  }

  static grpcBinaryOptionsMarketToBinaryOptionsMarket(
    market: GrpcBinaryOptionsMarketInfo,
  ): BinaryOptionsMarket {
    return {
      marketId: market.marketId,
      marketStatus: market.marketStatus,
      ticker: market.ticker,
      oracleSymbol: market.oracleSymbol,
      oracleProvider: market.oracleProvider,
      oracleType: market.oracleType,
      oracleScaleFactor: market.oracleScaleFactor,
      expirationTimestamp: Number(market.expirationTimestamp),
      settlementTimestamp: Number(market.settlementTimestamp),
      quoteDenom: market.quoteDenom,
      quoteToken: IndexerGrpcDerivativeTransformer.grpcTokenMetaToTokenMeta(
        market.quoteTokenMeta,
      ),
      makerFeeRate: market.makerFeeRate,
      takerFeeRate: market.takerFeeRate,
      serviceProviderFee: market.serviceProviderFee,
      minPriceTickSize: new BigNumber(market.minPriceTickSize).toNumber(),
      minQuantityTickSize: new BigNumber(market.minQuantityTickSize).toNumber(),
      minNotional: new BigNumber(market.minNotional).toNumber(),
      settlementPrice: market.settlementPrice,
    }
  }

  static grpcBinaryOptionsMarketsToBinaryOptionsMarkets(
    markets: GrpcBinaryOptionsMarketInfo[],
  ): BinaryOptionsMarket[] {
    return markets.map(
      IndexerGrpcDerivativeTransformer.grpcBinaryOptionsMarketToBinaryOptionsMarket,
    )
  }

  static grpcMarketToMarket(
    market: GrpcDerivativeMarketInfo,
  ): DerivativeMarket {
    return {
      oracleBase: market.oracleBase,
      oracleQuote: market.oracleQuote,
      oracleType: market.oracleType,
      oracleScaleFactor: market.oracleScaleFactor,
      reduceMarginRatio: market.reduceMarginRatio,
      initialMarginRatio: market.initialMarginRatio,
      maintenanceMarginRatio: market.maintenanceMarginRatio,
      isPerpetual: market.isPerpetual,
      marketId: market.marketId,
      marketStatus: market.marketStatus,
      ticker: market.ticker,
      quoteDenom: market.quoteDenom,
      quoteToken: IndexerGrpcDerivativeTransformer.grpcTokenMetaToTokenMeta(
        market.quoteTokenMeta,
      ),
      makerFeeRate: market.makerFeeRate,
      takerFeeRate: market.takerFeeRate,
      serviceProviderFee: market.serviceProviderFee,
      minPriceTickSize: new BigNumber(market.minPriceTickSize).toNumber(),
      minQuantityTickSize: new BigNumber(market.minQuantityTickSize).toNumber(),
      minNotional: new BigNumber(market.minNotional).toNumber(),
      perpetualMarketInfo:
        IndexerGrpcDerivativeTransformer.grpcPerpetualMarketInfoToPerpetualMarketInfo(
          market.perpetualMarketInfo,
        ),
      perpetualMarketFunding:
        IndexerGrpcDerivativeTransformer.grpcPerpetualMarketFundingToPerpetualMarketFunding(
          market.perpetualMarketFunding,
        ),
      expiryFuturesMarketInfo:
        IndexerGrpcDerivativeTransformer.grpcExpiryFuturesMarketInfoToExpiryFuturesMarketInfo(
          market.expiryFuturesMarketInfo,
        ),
    }
  }

  static grpcMarketsToMarkets(
    markets: GrpcDerivativeMarketInfo[],
  ): DerivativeMarket[] {
    return markets.map((market) =>
      IndexerGrpcDerivativeTransformer.grpcMarketToMarket(market),
    )
  }

  static grpcPositionDeltaToPositionDelta(
    positionDelta: GrpcPositionDelta,
  ): PositionDelta {
    return {
      tradeDirection: positionDelta.tradeDirection as TradeDirection,
      executionPrice: positionDelta.executionPrice,
      executionQuantity: positionDelta.executionQuantity,
      executionMargin: positionDelta.executionMargin,
    }
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
      IndexerGrpcDerivativeTransformer.grpcPriceLevelToPriceLevel(priceLevel),
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
      buys: IndexerGrpcDerivativeTransformer.grpcPriceLevelsToPriceLevels(buys),
      sells:
        IndexerGrpcDerivativeTransformer.grpcPriceLevelsToPriceLevels(sells),
    }
  }

  static grpcOrderbookV2ToOrderbookV2({
    sequence,
    buys,
    sells,
  }: {
    sequence: number
    buys: GrpcPriceLevel[]
    sells: GrpcPriceLevel[]
  }): OrderbookWithSequence {
    return {
      sequence,
      buys: IndexerGrpcDerivativeTransformer.grpcPriceLevelsToPriceLevels(buys),
      sells:
        IndexerGrpcDerivativeTransformer.grpcPriceLevelsToPriceLevels(sells),
    }
  }

  static priceLevelsToGrpcPriceLevels(
    priceLevels: PriceLevel[],
  ): GrpcPriceLevel[] {
    return priceLevels.map((priceLevel) => ({
      price: priceLevel.price,
      quantity: priceLevel.quantity,
      timestamp: BigInt(priceLevel.timestamp),
    }))
  }

  static grpcOrderToOrder(
    order: GrpcDerivativeLimitOrder,
  ): DerivativeLimitOrder {
    return {
      orderHash: order.orderHash,
      orderSide: order.orderSide as OrderSide,
      marketId: order.marketId,
      cid: order.cid,
      subaccountId: order.subaccountId,
      isReduceOnly: order.isReduceOnly,
      margin: order.margin,
      price: order.price,
      quantity: order.quantity,
      unfilledQuantity: order.unfilledQuantity,
      triggerPrice: order.triggerPrice,
      feeRecipient: order.feeRecipient,
      state: order.state as OrderState,
      createdAt: Number(order.createdAt),
      updatedAt: Number(order.updatedAt),
      orderNumber: Number(order.orderNumber),
      triggerAt: Number(order.triggerAt),
      orderType: order.orderType,
      isConditional: order.isConditional,
      placedOrderHash: order.placedOrderHash,
      executionType: order.executionType,
    }
  }

  static grpcOrdersToOrders(
    orders: GrpcDerivativeLimitOrder[],
  ): DerivativeLimitOrder[] {
    return orders.map((order) =>
      IndexerGrpcDerivativeTransformer.grpcOrderToOrder(order),
    )
  }

  static grpcOrderHistoryToOrderHistory(
    orderHistory: GrpcDerivativeOrderHistory,
  ): DerivativeOrderHistory {
    return {
      orderHash: orderHistory.orderHash,
      marketId: orderHistory.marketId,
      cid: orderHistory.cid,
      isActive: orderHistory.isActive,
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
      triggerAt: Number(orderHistory.triggerAt),
      isReduceOnly: orderHistory.isReduceOnly,
      direction: orderHistory.direction,
      isConditional: orderHistory.isConditional,
      placedOrderHash: orderHistory.placedOrderHash,
      margin: orderHistory.margin,
    }
  }

  static grpcOrderHistoryListToOrderHistoryList(
    orderHistory: GrpcDerivativeOrderHistory[],
    isConditional?: boolean,
  ): DerivativeOrderHistory[] {
    const filteredOrderHistory = isConditional
      ? orderHistory
      : orderHistory.filter((order) => order.state !== OrderState.Booked)

    return filteredOrderHistory.map((orderHistory) =>
      IndexerGrpcDerivativeTransformer.grpcOrderHistoryToOrderHistory(
        orderHistory,
      ),
    )
  }

  static grpcPositionToPosition(position: GrpcDerivativePosition): Position {
    return {
      marketId: position.marketId,
      subaccountId: position.subaccountId,
      direction: position.direction as TradeDirection,
      quantity: position.quantity,
      entryPrice: position.entryPrice,
      margin: position.margin,
      liquidationPrice: position.liquidationPrice,
      aggregateReduceOnlyQuantity: position.aggregateReduceOnlyQuantity,
      markPrice: position.markPrice,
      ticker: position.ticker,
      updatedAt: Number(position.updatedAt),
    }
  }

  static grpcPositionV2ToPositionV2(
    position: GrpcDerivativePositionV2,
  ): PositionV2 {
    return {
      marketId: position.marketId,
      subaccountId: position.subaccountId,
      direction: position.direction as TradeDirection,
      quantity: position.quantity,
      entryPrice: position.entryPrice,
      margin: position.margin,
      denom: position.denom,
      liquidationPrice: position.liquidationPrice,
      markPrice: position.markPrice,
      ticker: position.ticker,
      updatedAt: Number(position.updatedAt),
    }
  }

  static grpcPositionsToPositions(
    positions: GrpcDerivativePosition[],
  ): Position[] {
    return positions.map((position) =>
      IndexerGrpcDerivativeTransformer.grpcPositionToPosition(position),
    )
  }

  static grpcPositionsV2ToPositionsV2(
    positions: GrpcDerivativePositionV2[],
  ): PositionV2[] {
    return positions.map((position) =>
      IndexerGrpcDerivativeTransformer.grpcPositionV2ToPositionV2(position),
    )
  }

  static grpcTradeToTrade(trade: GrpcDerivativeTrade): DerivativeTrade {
    const positionDelta = trade.positionDelta
    const mappedPositionDelta = positionDelta
      ? IndexerGrpcDerivativeTransformer.grpcPositionDeltaToPositionDelta(
          positionDelta,
        )
      : zeroPositionDelta()

    return {
      cid: trade.cid,
      fee: trade.fee,
      pnl: trade.pnl,
      payout: trade.payout,
      tradeId: trade.tradeId,
      marketId: trade.marketId,
      orderHash: trade.orderHash,
      subaccountId: trade.subaccountId,
      feeRecipient: trade.feeRecipient,
      isLiquidation: trade.isLiquidation,
      executedAt: Number(trade.executedAt),
      executionSide: trade.executionSide as TradeExecutionSide,
      tradeExecutionType: trade.tradeExecutionType as TradeExecutionType,
      ...mappedPositionDelta,
    }
  }

  static grpcTradesToTrades(trades: GrpcDerivativeTrade[]): DerivativeTrade[] {
    return trades.map((trade) =>
      IndexerGrpcDerivativeTransformer.grpcTradeToTrade(trade),
    )
  }

  static grpcFundingPaymentToFundingPayment(
    fundingPayment: GrpcFundingPayment,
  ): FundingPayment {
    return {
      marketId: fundingPayment.marketId,
      subaccountId: fundingPayment.subaccountId,
      amount: fundingPayment.amount,
      timestamp: Number(fundingPayment.timestamp),
    }
  }

  static grpcFundingPaymentsToFundingPayments(
    fundingPayments: GrpcFundingPayment[],
  ): FundingPayment[] {
    return fundingPayments.map(
      IndexerGrpcDerivativeTransformer.grpcFundingPaymentToFundingPayment,
    )
  }

  static grpcFundingRateToFundingRate(
    fundingRate: GrpcFundingRate,
  ): FundingRate {
    return {
      marketId: fundingRate.marketId,
      rate: fundingRate.rate,
      timestamp: Number(fundingRate.timestamp),
    }
  }

  static grpcFundingRatesToFundingRates(
    fundingRates: GrpcFundingRate[],
  ): FundingRate[] {
    return fundingRates.map(
      IndexerGrpcDerivativeTransformer.grpcFundingRateToFundingRate,
    )
  }
}
