import type * as InjectiveRFQRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_rfq_rpc_pb'
import type {
  RFQSignMode,
  RFQQuoteType,
  GrpcRFQQuote,
  RFQRequestType,
  GrpcRFQRequest,
  RFQSettlementType,
  GrpcRFQSettlement,
  SettlementsResponse,
  RFQConditionalOrder,
  RFQProcessedQuoteType,
  GrpcRFQProcessedQuote,
  GrpcRFQConditionalOrder,
  RFQConditionalOrdersResponse,
} from '../types'

/**
 * @category Indexer Grpc Transformer
 */
export class IndexerGrpcRfqTransformer {
  static grpcRfqRequestToRfqRequest(
    grpcRequest: GrpcRFQRequest,
  ): RFQRequestType {
    return {
      margin: grpcRequest.margin,
      status: grpcRequest.status,
      marketId: grpcRequest.marketId,
      quantity: grpcRequest.quantity,
      direction: grpcRequest.direction,
      rfqId: Number(grpcRequest.rfqId),
      worstPrice: grpcRequest.worstPrice,
      expiry: Number(grpcRequest.expiry),
      height: Number(grpcRequest.height),
      createdAt: Number(grpcRequest.createdAt),
      updatedAt: Number(grpcRequest.updatedAt),
      clientId: grpcRequest.clientId.toString(),
      requestAddress: grpcRequest.requestAddress,
      transactionTime: Number(grpcRequest.transactionTime),
    }
  }

  static grpcRfqQuoteToRfqQuote(grpcQuote: GrpcRFQQuote): RFQQuoteType {
    return {
      price: grpcQuote.price,
      maker: grpcQuote.maker,
      taker: grpcQuote.taker,
      margin: grpcQuote.margin,
      status: grpcQuote.status,
      chainId: grpcQuote.chainId,
      marketId: grpcQuote.marketId,
      quantity: grpcQuote.quantity,
      clientId: grpcQuote.clientId,
      signature: grpcQuote.signature,
      rfqId: Number(grpcQuote.rfqId),
      height: Number(grpcQuote.height),
      priceCheck: grpcQuote.priceCheck,
      createdAt: Number(grpcQuote.createdAt),
      updatedAt: Number(grpcQuote.updatedAt),
      eventTime: Number(grpcQuote.eventTime),
      evmChainId: Number(grpcQuote.evmChainId),
      takerDirection: grpcQuote.takerDirection,
      contractAddress: grpcQuote.contractAddress,
      minFillQuantity: grpcQuote.minFillQuantity,
      signMode: grpcQuote.signMode as RFQSignMode,
      transactionTime: Number(grpcQuote.transactionTime),
      makerSubaccountNonce: Number(grpcQuote.makerSubaccountNonce),
      expiry: {
        ...(grpcQuote.expiry?.height && {
          height: Number(grpcQuote.expiry.height),
        }),
        ...(grpcQuote.expiry?.timestamp && {
          timestamp: Number(grpcQuote.expiry.timestamp),
        }),
      },
    }
  }

  static grpcRfqSettlementToRfqSettlement(
    grpcSettlement: GrpcRFQSettlement,
  ): RFQSettlementType {
    return {
      cid: grpcSettlement.cid,
      taker: grpcSettlement.taker,
      margin: grpcSettlement.margin,
      txHash: grpcSettlement.txHash,
      marketId: grpcSettlement.marketId,
      quantity: grpcSettlement.quantity,
      rfqId: Number(grpcSettlement.rfqId),
      direction: grpcSettlement.direction,
      worstPrice: grpcSettlement.worstPrice,
      height: Number(grpcSettlement.height),
      createdAt: Number(grpcSettlement.createdAt),
      updatedAt: Number(grpcSettlement.updatedAt),
      eventTime: Number(grpcSettlement.eventTime),
      fallbackMargin: grpcSettlement.fallbackMargin,
      fallbackQuantity: grpcSettlement.fallbackQuantity,
      transactionTime: Number(grpcSettlement.transactionTime),
      unfilledAction: grpcSettlement.unfilledAction
        ? {
            limit: grpcSettlement.unfilledAction.limit
              ? {
                  price: grpcSettlement.unfilledAction.limit.price,
                }
              : undefined,
            market: grpcSettlement.unfilledAction.market ? {} : undefined,
          }
        : undefined,
    }
  }

  static grpcRfqProcessedQuoteToRfqProcessedQuote(
    grpcProcessedQuote: GrpcRFQProcessedQuote,
  ): RFQProcessedQuoteType {
    return {
      error: grpcProcessedQuote.error,
      price: grpcProcessedQuote.price,
      maker: grpcProcessedQuote.maker,
      taker: grpcProcessedQuote.taker,
      margin: grpcProcessedQuote.margin,
      status: grpcProcessedQuote.status,
      chainId: grpcProcessedQuote.chainId,
      marketId: grpcProcessedQuote.marketId,
      quantity: grpcProcessedQuote.quantity,
      signature: grpcProcessedQuote.signature,
      clientId: grpcProcessedQuote.clientId,
      rfqId: Number(grpcProcessedQuote.rfqId),
      height: Number(grpcProcessedQuote.height),
      priceCheck: grpcProcessedQuote.priceCheck,
      createdAt: Number(grpcProcessedQuote.createdAt),
      updatedAt: Number(grpcProcessedQuote.updatedAt),
      eventTime: Number(grpcProcessedQuote.eventTime),
      evmChainId: Number(grpcProcessedQuote.evmChainId),
      executedMargin: grpcProcessedQuote.executedMargin,
      takerDirection: grpcProcessedQuote.takerDirection,
      contractAddress: grpcProcessedQuote.contractAddress,
      minFillQuantity: grpcProcessedQuote.minFillQuantity,
      signMode: grpcProcessedQuote.signMode as RFQSignMode,
      executedQuantity: grpcProcessedQuote.executedQuantity,
      transactionTime: Number(grpcProcessedQuote.transactionTime),
      makerSubaccountNonce: Number(grpcProcessedQuote.makerSubaccountNonce),
      expiry: grpcProcessedQuote.expiry
        ? {
            ...(grpcProcessedQuote.expiry.height && {
              height: Number(grpcProcessedQuote.expiry.height),
            }),
            ...(grpcProcessedQuote.expiry.timestamp && {
              timestamp: Number(grpcProcessedQuote.expiry.timestamp),
            }),
          }
        : undefined,
    }
  }

  static listSettlementsResponseToSettlements(
    response: InjectiveRFQRpcPb.ListSettlementResponse,
  ): SettlementsResponse {
    return {
      next: response.next,
      settlements: response.settlements.map(
        IndexerGrpcRfqTransformer.grpcRfqSettlementToRfqSettlement,
      ),
    }
  }

  static grpcConditionalOrderToConditionalOrder(
    grpcOrder: GrpcRFQConditionalOrder,
  ): RFQConditionalOrder {
    return {
      error: grpcOrder.error,
      txHash: grpcOrder.txHash,
      margin: grpcOrder.margin,
      status: grpcOrder.status,
      marketId: grpcOrder.marketId,
      quantity: grpcOrder.quantity,
      rfqId: Number(grpcOrder.rfqId),
      direction: grpcOrder.direction,
      worstPrice: grpcOrder.worstPrice,
      triggerType: grpcOrder.triggerType,
      triggerPrice: grpcOrder.triggerPrice,
      createdAt: Number(grpcOrder.createdAt),
      updatedAt: Number(grpcOrder.updatedAt),
      expiresAt: Number(grpcOrder.expiresAt),
      eventTime: Number(grpcOrder.eventTime),
      terminalAt: Number(grpcOrder.terminalAt),
      evmChainId: Number(grpcOrder.evmChainId),
      requestAddress: grpcOrder.requestAddress,
      minTotalFillQuantity: grpcOrder.minTotalFillQuantity,
    }
  }

  static listConditionalOrdersResponseToConditionalOrders(
    response: InjectiveRFQRpcPb.ListConditionalOrdersResponse,
  ): RFQConditionalOrdersResponse {
    return {
      next: response.next,
      orders: response.orders.map(
        IndexerGrpcRfqTransformer.grpcConditionalOrderToConditionalOrder,
      ),
    }
  }
}
