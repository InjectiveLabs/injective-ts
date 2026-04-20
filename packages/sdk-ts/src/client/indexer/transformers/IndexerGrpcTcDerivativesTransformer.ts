import { OrderState, TradeDirection } from '../../../types/index.js'
import type * as InjectiveTCDerivativesRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_tc_derivatives_rpc_pb'
import type {
  OrderSide,
  TradeExecutionSide,
  TradeExecutionType,
} from '../../../types/index.js'
import type {
  TcPositionDelta,
  GrpcTcPositionDelta,
  TcDerivativePosition,
  TcDerivativeLimitOrder,
  TcDerivativeTradeHistory,
  GrpcTcDerivativePosition,
  TcDerivativeOrderHistory,
  GrpcTcDerivativeLimitOrder,
  TcDerivativeTradesResponse,
  TcDerivativeOrdersResponse,
  GrpcTcDerivativeTradeHistory,
  GrpcTcDerivativeOrderHistory,
  TcDerivativesPositionsResponse,
  TcDerivativesOrdersHistoryResponse,
} from '../types/tc-derivatives.js'

const zeroPositionDelta = () => ({
  executionPrice: '0',
  executionMargin: '0',
  executionQuantity: '0',
  tradeDirection: TradeDirection.Buy,
})

/**
 * @category Indexer Grpc Transformer
 */
export class IndexerGrpcTcDerivativesTransformer {
  static grpcPositionDeltaToPositionDelta(
    positionDelta: GrpcTcPositionDelta,
  ): TcPositionDelta {
    return {
      executionPrice: positionDelta.executionPrice,
      executionMargin: positionDelta.executionMargin,
      executionQuantity: positionDelta.executionQuantity,
      tradeDirection: positionDelta.tradeDirection as TradeDirection,
    }
  }

  static grpcOrderHistoryToOrderHistory(
    order: GrpcTcDerivativeOrderHistory,
  ): TcDerivativeOrderHistory {
    return {
      cid: order.cid,
      price: order.price,
      margin: order.margin,
      txHash: order.txHash,
      marketId: order.marketId,
      isActive: order.isActive,
      quantity: order.quantity,
      orderHash: order.orderHash,
      orderType: order.orderType,
      state: order.state as OrderState,
      subaccountId: order.subaccountId,
      triggerPrice: order.triggerPrice,
      isReduceOnly: order.isReduceOnly,
      executionType: order.executionType,
      createdAt: Number(order.createdAt),
      updatedAt: Number(order.updatedAt),
      isConditional: order.isConditional,
      triggerAt: Number(order.triggerAt),
      filledQuantity: order.filledQuantity,
      placedOrderHash: order.placedOrderHash,
      direction: order.direction as TradeDirection,
    }
  }

  static grpcTradeToTrade(
    trade: GrpcTcDerivativeTradeHistory,
  ): TcDerivativeTradeHistory {
    const positionDelta = trade.positionDelta
    const mappedPositionDelta = positionDelta
      ? IndexerGrpcTcDerivativesTransformer.grpcPositionDeltaToPositionDelta(
          positionDelta,
        )
      : zeroPositionDelta()

    return {
      fee: trade.fee,
      cid: trade.cid,
      pnl: trade.pnl,
      payout: trade.payout,
      tradeId: trade.tradeId,
      marketId: trade.marketId,
      orderHash: trade.orderHash,
      subaccountId: trade.subaccountId,
      feeRecipient: trade.feeRecipient,
      isLiquidation: trade.isLiquidation,
      executedAt: Number(trade.executedAt),
      positionIsLong: trade.positionIsLong,
      positionEntryPrice: trade.positionEntryPrice,
      positionOpenedAt: Number(trade.positionOpenedAt),
      executionSide: trade.executionSide as TradeExecutionSide,
      tradeExecutionType: trade.tradeExecutionType as TradeExecutionType,
      ...mappedPositionDelta,
    }
  }

  static grpcPositionToPosition(
    position: GrpcTcDerivativePosition,
  ): TcDerivativePosition {
    return {
      upnl: position.upnl,
      denom: position.denom,
      ticker: position.ticker,
      margin: position.margin,
      marketId: position.marketId,
      quantity: position.quantity,
      markPrice: position.markPrice,
      entryPrice: position.entryPrice,
      fundingSum: position.fundingSum,
      fundingLast: position.fundingLast,
      subaccountId: position.subaccountId,
      updatedAt: Number(position.updatedAt),
      liquidationPrice: position.liquidationPrice,
      direction: position.direction as TradeDirection,
      cumulativeFundingEntry: position.cumulativeFundingEntry,
      effectiveCumulativeFundingEntry: position.effectiveCumulativeFundingEntry,
    }
  }

  static grpcDerivativeLimitOrderToDerivativeLimitOrder(
    order: GrpcTcDerivativeLimitOrder,
  ): TcDerivativeLimitOrder {
    return {
      cid: order.cid,
      price: order.price,
      margin: order.margin,
      marketId: order.marketId,
      quantity: order.quantity,
      orderHash: order.orderHash,
      orderType: order.orderType,
      subaccountId: order.subaccountId,
      isReduceOnly: order.isReduceOnly,
      triggerPrice: order.triggerPrice,
      feeRecipient: order.feeRecipient,
      state: order.state as OrderState,
      createdAt: Number(order.createdAt),
      updatedAt: Number(order.updatedAt),
      isConditional: order.isConditional,
      triggerAt: Number(order.triggerAt),
      executionType: order.executionType,
      orderNumber: Number(order.orderNumber),
      placedOrderHash: order.placedOrderHash,
      orderSide: order.orderSide as OrderSide,
      unfilledQuantity: order.unfilledQuantity,
    }
  }

  static ordersHistoryResponseToOrdersHistory(
    response: InjectiveTCDerivativesRpcPb.OrdersHistoryResponse,
  ): TcDerivativesOrdersHistoryResponse {
    const filteredOrderHistory = response.orders?.filter(
      (order) => order.state !== OrderState.Booked,
    )

    return {
      next: response.next,
      orders: filteredOrderHistory.map(
        IndexerGrpcTcDerivativesTransformer.grpcOrderHistoryToOrderHistory,
      ),
    }
  }

  static ordersResponseToOrders(
    response: InjectiveTCDerivativesRpcPb.OrdersResponse,
  ): TcDerivativeOrdersResponse {
    return {
      next: response.next,
      orders: response.orders.map(
        IndexerGrpcTcDerivativesTransformer.grpcDerivativeLimitOrderToDerivativeLimitOrder,
      ),
    }
  }

  static tradesResponseToTrades(
    response: InjectiveTCDerivativesRpcPb.TradesResponse,
  ): TcDerivativeTradesResponse {
    return {
      next: response.next,
      trades: response.trades.map(
        IndexerGrpcTcDerivativesTransformer.grpcTradeToTrade,
      ),
    }
  }

  static positionsResponseToPositions(
    response: InjectiveTCDerivativesRpcPb.PositionsResponse,
  ): TcDerivativesPositionsResponse {
    return {
      next: response.next,
      total: response.total ? Number(response.total) : undefined,
      positions: response.positions.map(
        IndexerGrpcTcDerivativesTransformer.grpcPositionToPosition,
      ),
    }
  }
}
