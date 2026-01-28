import { IndexerGrpcRfqTransformer } from './IndexerGrpcRfqTransformer.js'
import type * as InjectiveRFQRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_rfqrpc_pb'
import type { StreamOperation } from '../../../types/index.js'

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
      operation: response.streamOperation as StreamOperation,
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
      operation: response.streamOperation as StreamOperation,
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
      operation: response.streamOperation as StreamOperation,
    }
  }
}
