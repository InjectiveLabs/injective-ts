import { BaseWasmQuery } from './BaseWasmQuery'
import { toBase64 } from '../../../../utils'

export declare namespace QueryVaultUserLpBalanceArg {
  export interface Params {
    subaccountId: string
    userAddress: string
  }
}

export class QueryVaultUserLpBalance extends BaseWasmQuery<QueryVaultUserLpBalanceArg.Params> {
  toPayload() {
    return toBase64({
      get_user_lp_balance: {
        subaccount_id: this.params.subaccountId,
        user_address: this.params.userAddress,
      },
    })
  }
}
