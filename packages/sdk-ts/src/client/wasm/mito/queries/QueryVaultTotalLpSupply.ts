import { BaseWasmQuery } from './BaseWasmQuery'
import { toBase64 } from '../../../../utils'

export declare namespace QueryVaultTotalLpSupplyArg {
  export interface Params {
    subaccountId: string
  }
}

export class QueryVaultTotalLpSupply extends BaseWasmQuery<QueryVaultTotalLpSupplyArg.Params> {
  toPayload() {
    return toBase64({
      get_total_lp_supply: {
        subaccount_id: this.params.subaccountId,
      },
    })
  }
}
