import { StreamOperation } from '../../../types'
import { StreamPricesResponse } from '@injectivelabs/indexer-api/injective_oracle_rpc_pb'

export class IndexerOracleStreamTransformer {
  static pricesStreamCallback = (response: StreamPricesResponse) => ({
    price: response.getPrice(),
    operation: StreamOperation.Update as StreamOperation,
    timestamp: response.getTimestamp(),
  })
}
