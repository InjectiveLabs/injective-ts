import { StreamOperation } from '../../../types'
import { StreamPricesResponse } from '@injectivelabs/indexer-proto-ts/injective_oracle_rpc'

/**
 * @category Indexer Stream Transformer
 */
export class IndexerOracleStreamTransformer {
  static pricesStreamCallback = (response: StreamPricesResponse) => ({
    price: response.price,
    operation: StreamOperation.Update as StreamOperation,
    timestamp: parseInt(response.timestamp, 10),
  })
}
