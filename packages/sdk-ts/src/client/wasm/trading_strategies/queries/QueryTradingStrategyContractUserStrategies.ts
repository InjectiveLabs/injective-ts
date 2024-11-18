import { BaseWasmQuery } from '../../BaseWasmQuery.js'
import { toBase64 } from '../../../../utils/index.js'

export declare namespace QueryTradingStrategyContractUserStrategies {
  export interface Params {
    user: string
  }
}

export class QueryTradingStrategyContractUserStrategies extends BaseWasmQuery<QueryTradingStrategyContractUserStrategies.Params> {
  toPayload() {
    const payload = toBase64({
      user_strategy: {
        user: this.params.user,
      },
    })

    return payload
  }
}
