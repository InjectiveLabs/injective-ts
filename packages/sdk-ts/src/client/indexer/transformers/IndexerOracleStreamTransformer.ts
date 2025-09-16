import { StreamOperation } from '../../../types/index.js'
import type { InjectiveOracleRpc } from '@injectivelabs/indexer-proto-ts'

/**
 * @category Indexer Stream Transformer
 */
export class IndexerOracleStreamTransformer {
  static pricesStreamCallback = (
    response: InjectiveOracleRpc.StreamPricesResponse,
  ) => ({
    price: response.price,
    operation: StreamOperation.Update as StreamOperation,
    timestamp: parseInt(response.timestamp, 10),
  })

  static pricesByMarketsCallback = (
    response: InjectiveOracleRpc.StreamPricesByMarketsResponse,
  ) => ({
    ...response,
  })
}
