import { StreamOperation } from '../../../types'
import {
  StreamPricesResponse,
  StreamPricesByMarketsResponse,
} from '@injectivelabs/indexer-api/injective_oracle_rpc_pb'

/**
 * @category Indexer Stream Transformer
 */
export class IndexerOracleStreamTransformer {
  static pricesStreamCallback = (response: StreamPricesResponse) => ({
    price: response.getPrice(),
    operation: StreamOperation.Update as StreamOperation,
    timestamp: response.getTimestamp(),
  })

  static pricesByMarketsCallback = (
    response: StreamPricesByMarketsResponse,
  ) => ({
    price: response.getPrice(),
    marketId: response.getMarketId(),
    timestamp: response.getTimestamp(),
  })
}
