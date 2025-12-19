import { StreamOperation } from '../../../types/index.js'
import { bigIntToNumber } from '../../../utils/helpers.js'
import type * as InjectiveOracleRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_oracle_rpc_pb'

/**
 * @category Indexer Stream Transformer
 */
export class IndexerOracleStreamTransformer {
  static pricesStreamCallback = (
    response: InjectiveOracleRpcPb.StreamPricesResponse,
  ) => ({
    price: response.price,
    timestamp: bigIntToNumber(response.timestamp),
    operation: StreamOperation.Update as StreamOperation,
  })

  static pricesByMarketsCallback = (
    response: InjectiveOracleRpcPb.StreamPricesByMarketsResponse,
  ) => ({
    ...response,
  })
}
