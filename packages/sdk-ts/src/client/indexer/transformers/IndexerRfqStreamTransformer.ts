import { IndexerGrpcRfqTransformer } from './IndexerGrpcRfqTransformer.js'
import type * as InjectiveRFQRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_rfq_rpc_pb'

/**
 * @category Indexer Stream Transformer
 */
export class IndexerRfqStreamTransformer {
  static requestStreamCallback = (
    response: InjectiveRFQRpcPb.StreamRequestResponse,
  ) => {
    const request = response.request

    return {
      request: request
        ? IndexerGrpcRfqTransformer.grpcRfqRequestToRfqRequest(request)
        : undefined,
    }
  }

  static quoteStreamCallback = (
    response: InjectiveRFQRpcPb.StreamQuoteResponse,
  ) => {
    const quote = response.quote

    return {
      quote: quote
        ? IndexerGrpcRfqTransformer.grpcRfqQuoteToRfqQuote(quote)
        : undefined,
    }
  }

  static settlementStreamCallback = (
    response: InjectiveRFQRpcPb.StreamSettlementResponse,
  ) => {
    const settlement = response.settlement

    return {
      settlement: settlement
        ? IndexerGrpcRfqTransformer.grpcRfqSettlementToRfqSettlement(settlement)
        : undefined,
    }
  }
}
