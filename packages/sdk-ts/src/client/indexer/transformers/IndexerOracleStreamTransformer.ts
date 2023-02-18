import { StreamOperation } from '../../../types'
import {
  StreamPricesResponse,
  // StreamPricesByMarketsResponse,
} from '@injectivelabs/indexer-proto-ts/injective_oracle_rpc'

/**
 * @category Indexer Stream Transformer
 */
export class IndexerOracleStreamTransformer {
  static pricesStreamCallback = (response: StreamPricesResponse) => ({
    price: response.price,
    operation: StreamOperation.Update as StreamOperation,
    timestamp: parseInt(response.timestamp, 10),
  })

  static pricesByMarketsCallback = (
    response: StreamPricesByMarketsResponse,
  ) => ({
    price: response.getPrice(),
    marketId: response.getMarketId(),
    timestamp: response.getTimestamp(),
  })
}
