import { BaseWasmQuery } from '../../BaseWasmQuery'
import { toBase64 } from '../../../../utils'

export declare namespace QueryTradingStrategyContractUserStrategies {
  export interface Params {
    user: string
  }
}

export class QueryTradingStrategyContractUserStrategies extends BaseWasmQuery<QueryTradingStrategyContractUserStrategies.Params> {
  toPayload() {
    return toBase64({
      user: this.params.user,
    })
  }
}
