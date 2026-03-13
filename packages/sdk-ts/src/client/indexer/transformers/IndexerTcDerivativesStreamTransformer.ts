import { IndexerGrpcTcDerivativesTransformer } from './IndexerGrpcTcDerivativesTransformer.js'
import type * as InjectiveTCDerivativesRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_tc_derivatives_rpc_pb'

/**
 * @category Indexer Stream Transformer
 */
export class IndexerTcDerivativesStreamTransformer {
  static orderHistoryStreamCallback = (
    response: InjectiveTCDerivativesRpcPb.StreamOrdersHistoryResponse,
  ) => {
    const order = response.order

    return {
      operationType: response.operationType,
      timestamp: Number(response.timestamp),
      order: order
        ? IndexerGrpcTcDerivativesTransformer.grpcOrderHistoryToOrderHistory(
            order,
          )
        : undefined,
    }
  }

  static tradesStreamCallback = (
    response: InjectiveTCDerivativesRpcPb.StreamTradesResponse,
  ) => {
    const trade = response.trade

    return {
      operationType: response.operationType,
      timestamp: Number(response.timestamp),
      trade: trade
        ? IndexerGrpcTcDerivativesTransformer.grpcTradeToTrade(trade)
        : undefined,
    }
  }
}
