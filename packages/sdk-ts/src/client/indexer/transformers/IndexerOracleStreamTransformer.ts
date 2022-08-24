import { StreamOperation } from '../../../types'
import { StreamPricesResponse } from '@injectivelabs/indexer-api/injective_oracle_rpc_pb'

/**
 * @category Indexer Stream Transformer
 */
export class IndexerOracleStreamTransformer {
  static pricesStreamCallback = (response: StreamPricesResponse) => ({
    price: response.getPrice(),
    operation: StreamOperation.Update as StreamOperation,
    timestamp: response.getTimestamp(),
  })
}
