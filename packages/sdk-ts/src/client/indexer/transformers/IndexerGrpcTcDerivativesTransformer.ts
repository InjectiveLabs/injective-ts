import { TradeDirection } from 'packages/sdk-ts/src/types/exchange.js'
import type * as InjectiveTCDerivativesRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_tc_derivatives_rpc_pb'
import type {
  TCPositionDelta,
  TCDerivativeTrade,
  GrpcTCPositionDelta,
  TCDerivativePosition,
  GrpcTCDerivativeTrade,
  TCDerivativeOrderHistory,
  GrpcTCDerivativePosition,
  TCDerivativesTradesResponse,
  GrpcTCDerivativeOrderHistory,
  TCDerivativesPositionsResponse,
  TCDerivativesOrdersHistoryResponse,
} from '../types/tc-derivatives.js'

const zeroPositionDelta = () => ({
  tradeDirection: TradeDirection.Buy,
  executionPrice: '0',
  executionQuantity: '0',
  executionMargin: '0',
})

/**
 * @category Indexer Grpc Transformer
 */
export class IndexerGrpcTcDerivativesTransformer {
  static grpcPositionDeltaToPositionDelta(
    positionDelta: GrpcTCPositionDelta | undefined,
  ): TCPositionDelta | undefined {
    if (!positionDelta) {
      return undefined
    }

    return {
      tradeDirection: positionDelta.tradeDirection,
      executionPrice: positionDelta.executionPrice,
      executionMargin: positionDelta.executionMargin,
      executionQuantity: positionDelta.executionQuantity,
    }
  }

  static grpcOrderHistoryToOrderHistory(
    order: GrpcTCDerivativeOrderHistory,
  ): TCDerivativeOrderHistory {
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

  static grpcTradeToTrade(trade: GrpcTCDerivativeTrade): TCDerivativeTrade {
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
    position: GrpcTCDerivativePosition,
  ): TCDerivativePosition {
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

  static ordersHistoryResponseToOrdersHistory(
    response: InjectiveTCDerivativesRpcPb.OrdersHistoryResponse,
  ): TCDerivativesOrdersHistoryResponse {
    return {
      orders: response.orders.map(
        IndexerGrpcTcDerivativesTransformer.grpcOrderHistoryToOrderHistory,
      ),
      next: response.next,
    }
  }

  static tradesResponseToTrades(
    response: InjectiveTCDerivativesRpcPb.TradesResponse,
  ): TCDerivativesTradesResponse {
    return {
      trades: response.trades.map(
        IndexerGrpcTcDerivativesTransformer.grpcTradeToTrade,
      ),
      next: response.next,
    }
  }

  static positionsResponseToPositions(
    response: InjectiveTCDerivativesRpcPb.PositionsResponse,
  ): TCDerivativesPositionsResponse {
    return {
      positions: response.positions.map(
        IndexerGrpcTcDerivativesTransformer.grpcPositionToPosition,
      ),
      next: response.next,
    }
  }
}
