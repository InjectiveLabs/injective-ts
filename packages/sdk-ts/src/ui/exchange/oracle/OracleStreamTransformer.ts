import { StreamOperation } from '../../../types'
import { StreamPricesResponse } from './types'

export class OracleStreamTransformer {
  static pricesStreamCallback = (response: StreamPricesResponse) => ({
    price: response.getPrice(),
    operation: StreamOperation.Update as StreamOperation,
    timestamp: response.getTimestamp(),
  })
}
