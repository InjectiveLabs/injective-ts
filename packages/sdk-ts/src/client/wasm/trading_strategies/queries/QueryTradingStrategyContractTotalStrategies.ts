import { BaseWasmQuery } from '../../BaseWasmQuery'
import { toBase64 } from '../../../../utils'

export declare namespace QueryTradingStrategyContractTotalStrategies {
  export interface Params {
    user: string
  }
}

export class QueryTradingStrategyContractTotalStrategies extends BaseWasmQuery<QueryTradingStrategyContractTotalStrategies.Params> {
  toPayload() {
    return toBase64({
      user: this.params.user,
    })
  }
}
