import { BaseWasmQuery } from '../../BaseWasmQuery.js'
import { toBase64 } from '../../../../utils/index.js'

export declare namespace QueryTradingStrategyContractAllStrategies {
  export interface Params {
    startAfter?: string
    limit?: number
  }
}

export class QueryTradingStrategyContractAllStrategies extends BaseWasmQuery<QueryTradingStrategyContractAllStrategies.Params> {
  toPayload() {
    const payload = toBase64({
      all_strategies: {
        start_after: this.params.startAfter,
        limit: this.params.limit,
      },
    })

    return payload
  }
}
