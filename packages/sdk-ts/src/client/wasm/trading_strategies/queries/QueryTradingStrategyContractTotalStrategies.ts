import { BaseWasmQuery } from '../../BaseWasmQuery.js'
import { toBase64 } from '../../../../utils/index.js'

export declare namespace QueryTradingStrategyContractTotalStrategies {
  export interface Params {}
}

export class QueryTradingStrategyContractTotalStrategies extends BaseWasmQuery<QueryTradingStrategyContractTotalStrategies.Params> {
  toPayload() {
    const payload = toBase64({
      total_strategies: {},
    })

    return payload
  }
}
