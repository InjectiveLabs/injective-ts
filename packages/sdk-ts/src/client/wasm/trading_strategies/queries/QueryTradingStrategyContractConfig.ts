import { BaseWasmQuery } from '../../BaseWasmQuery'
import { toBase64 } from '../../../../utils'

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
