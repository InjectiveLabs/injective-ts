import { TradeDirection } from '../../../types/index.js'
import type * as InjectiveTCDerivativesRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_tc_derivatives_rpc_pb'
import type {
  TcPositionDelta,
  GrpcTcPositionDelta,
  TcDerivativePosition,
  TcDerivativeLimitOrder,
  TcDerivativeTradeHistory,
  TcDerivativeOrderHistory,
  GrpcTcDerivativePosition,
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
      tradeDirection: positionDelta.tradeDirection,
      executionPrice: positionDelta.executionPrice,
      executionMargin: positionDelta.executionMargin,
      executionQuantity: positionDelta.executionQuantity,
    }
  }

  static grpcOrderHistoryToOrderHistory(
    order: GrpcTcDerivativeOrderHistory,
  ): TcDerivativeOrderHistory {
    return {
      cid: order.cid,
      price: order.price,
      state: order.state,
      margin: order.margin,
      txHash: order.txHash,
      marketId: order.marketId,
      isActive: order.isActive,
      quantity: order.quantity,
      orderHash: order.orderHash,
      orderType: order.orderType,
      direction: order.direction,
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
      executionSide: trade.executionSide,
      executedAt: Number(trade.executedAt),
      tradeExecutionType: trade.tradeExecutionType,
      ...mappedPositionDelta,
    }
  }

  static grpcPositionToPosition(
    position: GrpcTcDerivativePosition,
  ): TcDerivativePosition {
    return {
      denom: position.denom,
      ticker: position.ticker,
      margin: position.margin,
      marketId: position.marketId,
      quantity: position.quantity,
      direction: position.direction,
      markPrice: position.markPrice,
      entryPrice: position.entryPrice,
      fundingSum: position.fundingSum,
      fundingLast: position.fundingLast,
      subaccountId: position.subaccountId,
      updatedAt: Number(position.updatedAt),
      liquidationPrice: position.liquidationPrice,
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
      state: order.state,
      margin: order.margin,
      marketId: order.marketId,
      quantity: order.quantity,
      orderHash: order.orderHash,
      orderSide: order.orderSide,
      orderType: order.orderType,
      subaccountId: order.subaccountId,
      isReduceOnly: order.isReduceOnly,
      triggerPrice: order.triggerPrice,
      feeRecipient: order.feeRecipient,
      createdAt: Number(order.createdAt),
      updatedAt: Number(order.updatedAt),
      isConditional: order.isConditional,
      triggerAt: Number(order.triggerAt),
      executionType: order.executionType,
      orderNumber: Number(order.orderNumber),
      placedOrderHash: order.placedOrderHash,
      unfilledQuantity: order.unfilledQuantity,
    }
  }

  static ordersHistoryResponseToOrdersHistory(
    response: InjectiveTCDerivativesRpcPb.OrdersHistoryResponse,
  ): TcDerivativesOrdersHistoryResponse {
    return {
      orders: response.orders.map(
        IndexerGrpcTcDerivativesTransformer.grpcOrderHistoryToOrderHistory,
      ),
      next: response.next,
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
      trades: response.trades.map(
        IndexerGrpcTcDerivativesTransformer.grpcTradeToTrade,
      ),
      next: response.next,
    }
  }

  static positionsResponseToPositions(
    response: InjectiveTCDerivativesRpcPb.PositionsResponse,
  ): TcDerivativesPositionsResponse {
    return {
      positions: response.positions.map(
        IndexerGrpcTcDerivativesTransformer.grpcPositionToPosition,
      ),
      next: response.next,
      total: response.total ? Number(response.total) : undefined,
    }
  }
}
