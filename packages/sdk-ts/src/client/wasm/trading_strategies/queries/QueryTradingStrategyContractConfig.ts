import { toBase64 } from '../../../../utils/index.js'
import { BaseWasmQuery } from '../../BaseWasmQuery.js'

export declare namespace QueryTradingStrategyContractConfig {
  export interface Params {}
}

export class QueryTradingStrategyContractConfig extends BaseWasmQuery<QueryTradingStrategyContractConfig.Params> {
  toPayload() {
    const payload = toBase64({
      config: {},
    })

    return payload
  }
}
