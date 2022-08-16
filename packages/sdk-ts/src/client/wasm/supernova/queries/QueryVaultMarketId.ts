import { BaseWasmQuery } from './BaseWasmQuery'
import { toBase64 } from '../../../../utils'

export declare namespace QueryVaultMarketIdArg {
  export interface Params {
    subaccountId: string
  }
}

export class QueryVaultMarketId extends BaseWasmQuery<QueryVaultMarketIdArg.Params> {
  toPayload() {
    return toBase64({
      get_market_id: {
        subaccount_id: this.params.subaccountId,
      },
    })
  }
}
