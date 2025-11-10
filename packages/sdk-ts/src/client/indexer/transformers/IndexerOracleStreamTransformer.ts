import { StreamOperation } from '../../../types/index.js'
import type * as InjectiveOracleRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_oracle_rpc_pb'

/**
 * @category Indexer Stream Transformer
 */
export class IndexerOracleStreamTransformer {
  static pricesStreamCallback = (
    response: InjectiveOracleRpcPb.StreamPricesResponse,
  ) => ({
    price: response.price,
    operation: StreamOperation.Update as StreamOperation,
    timestamp:
      typeof response.timestamp === 'bigint'
        ? Number(response.timestamp)
        : parseInt(response.timestamp, 10),
  })

  static pricesByMarketsCallback = (
    response: InjectiveOracleRpcPb.StreamPricesByMarketsResponse,
  ) => ({
    ...response,
  })
}
