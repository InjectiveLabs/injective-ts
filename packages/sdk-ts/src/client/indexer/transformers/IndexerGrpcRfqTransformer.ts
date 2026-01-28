import type * as InjectiveRFQRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_rfqrpc_pb'
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
      rfqId: grpcRequest.rfqId.toString(),
      marketId: grpcRequest.marketId,
      direction: grpcRequest.direction,
      margin: grpcRequest.margin,
      quantity: grpcRequest.quantity,
      worstPrice: grpcRequest.worstPrice,
      requestAddress: grpcRequest.requestAddress,
      expiry: Number(grpcRequest.expiry),
      status: grpcRequest.status,
      createdAt: Number(grpcRequest.createdAt),
      updatedAt: Number(grpcRequest.updatedAt),
      transactionTime: Number(grpcRequest.transactionTime),
      height: Number(grpcRequest.height),
    }
  }

  static grpcRfqQuoteToRfqQuote(grpcQuote: GrpcRFQQuote): RFQQuote {
    return {
      marketId: grpcQuote.marketId,
      rfqId: grpcQuote.rfqId.toString(),
      takerDirection: grpcQuote.takerDirection,
      margin: grpcQuote.margin,
      quantity: grpcQuote.quantity,
      price: grpcQuote.price,
      expiry: Number(grpcQuote.expiry),
      maker: grpcQuote.maker,
      taker: grpcQuote.taker,
      signature: grpcQuote.signature,
      status: grpcQuote.status,
      createdAt: Number(grpcQuote.createdAt),
      updatedAt: Number(grpcQuote.updatedAt),
      height: Number(grpcQuote.height),
      eventTime: Number(grpcQuote.eventTime),
      transactionTime: Number(grpcQuote.transactionTime),
    }
  }

  static grpcRfqSettlementToRfqSettlement(
    grpcSettlement: GrpcRFQSettlement,
  ): RFQSettlement {
    return {
      rfqId: grpcSettlement.rfqId.toString(),
      marketId: grpcSettlement.marketId,
      taker: grpcSettlement.taker,
      direction: grpcSettlement.direction,
      margin: grpcSettlement.margin,
      quantity: grpcSettlement.quantity,
      worstPrice: grpcSettlement.worstPrice,
      maker: grpcSettlement.maker,
      price: grpcSettlement.price,
      createdAt: Number(grpcSettlement.createdAt),
      eventTime: Number(grpcSettlement.eventTime),
      height: Number(grpcSettlement.height),
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
      total: Number(response.total),
    }
  }
}
