import type * as InjectiveRFQRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_rfq_rpc_pb'
import type {
  RFQQuote,
  RFQRequest,
  GrpcRFQQuote,
  RFQSettlement,
  GrpcRFQRequest,
  GrpcRFQSettlement,
  SettlementsResponse,
  OpenRequestsResponse,
  PendingQuotesResponse,
} from '../types/rfq.js'

/**
 * @category Indexer Grpc Transformer
 */
export class IndexerGrpcRfqTransformer {
  static grpcRfqRequestToRfqRequest(grpcRequest: GrpcRFQRequest): RFQRequest {
    return {
      margin: grpcRequest.margin,
      status: grpcRequest.status,
      marketId: grpcRequest.marketId,
      quantity: grpcRequest.quantity,
      direction: grpcRequest.direction,
      worstPrice: grpcRequest.worstPrice,
      expiry: Number(grpcRequest.expiry),
      height: Number(grpcRequest.height),
      rfqId: grpcRequest.rfqId.toString(),
      createdAt: Number(grpcRequest.createdAt),
      updatedAt: Number(grpcRequest.updatedAt),
      requestAddress: grpcRequest.requestAddress,
      transactionTime: Number(grpcRequest.transactionTime),
    }
  }

  static grpcRfqQuoteToRfqQuote(grpcQuote: GrpcRFQQuote): RFQQuote {
    return {
      price: grpcQuote.price,
      maker: grpcQuote.maker,
      taker: grpcQuote.taker,
      margin: grpcQuote.margin,
      status: grpcQuote.status,
      chainId: grpcQuote.chainId,
      marketId: grpcQuote.marketId,
      quantity: grpcQuote.quantity,
      signature: grpcQuote.signature,
      expiry: Number(grpcQuote.expiry),
      height: Number(grpcQuote.height),
      rfqId: grpcQuote.rfqId.toString(),
      createdAt: Number(grpcQuote.createdAt),
      updatedAt: Number(grpcQuote.updatedAt),
      eventTime: Number(grpcQuote.eventTime),
      takerDirection: grpcQuote.takerDirection,
      contractAddress: grpcQuote.contractAddress,
      transactionTime: Number(grpcQuote.transactionTime),
    }
  }

  static grpcRfqSettlementToRfqSettlement(
    grpcSettlement: GrpcRFQSettlement,
  ): RFQSettlement {
    return {
      taker: grpcSettlement.taker,
      margin: grpcSettlement.margin,
      marketId: grpcSettlement.marketId,
      quantity: grpcSettlement.quantity,
      direction: grpcSettlement.direction,
      worstPrice: grpcSettlement.worstPrice,
      height: Number(grpcSettlement.height),
      rfqId: grpcSettlement.rfqId.toString(),
      createdAt: Number(grpcSettlement.createdAt),
      updatedAt: Number(grpcSettlement.updatedAt),
      eventTime: Number(grpcSettlement.eventTime),
      fallbackMargin: grpcSettlement.fallbackMargin,
      fallbackQuantity: grpcSettlement.fallbackQuantity,
      transactionTime: Number(grpcSettlement.transactionTime),
    }
  }

  static openRequestsResponseToOpenRequests(
    response: InjectiveRFQRpcPb.GetOpenRequestsResponse,
  ): OpenRequestsResponse {
    return {
      requests: response.requests.map(
        IndexerGrpcRfqTransformer.grpcRfqRequestToRfqRequest,
      ),
    }
  }

  static pendingQuotesResponseToPendingQuotes(
    response: InjectiveRFQRpcPb.GetPendingQuotesResponse,
  ): PendingQuotesResponse {
    return {
      quotes: response.quotes.map(
        IndexerGrpcRfqTransformer.grpcRfqQuoteToRfqQuote,
      ),
    }
  }

  static listSettlementsResponseToSettlements(
    response: InjectiveRFQRpcPb.ListSettlementResponse,
  ): SettlementsResponse {
    return {
      settlements: response.settlements.map(
        IndexerGrpcRfqTransformer.grpcRfqSettlementToRfqSettlement,
      ),
      next: response.next,
    }
  }
}
