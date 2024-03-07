import { BaseWasmQuery } from '../../BaseWasmQuery'
import { toBase64 } from '../../../../utils'

export declare namespace QueryTradingStrategyContractStrategies {
  export interface Params {
    startAfter?: string
    limit?: number
  }
}

export class QueryTradingStrategyContractStrategies extends BaseWasmQuery<QueryTradingStrategyContractStrategies.Params> {
  toPayload() {
    return toBase64({
      start_after: this.params.startAfter,
      limit: this.params.limit,
    })
  }
}
