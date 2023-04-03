import { BaseWasmQuery } from './BaseWasmQuery'
import { toBase64 } from '../../../../utils'

export declare namespace QueryLockedLpFundsArg {
  export interface Params {
    subaccountId: string
    userAddress: string
  }
}

export class QueryLockedLpFunds extends BaseWasmQuery<QueryLockedLpFundsArg.Params> {
  toPayload() {
    return toBase64({
      get_locked_l_p_funds: {
        subaccount_id: this.params.subaccountId,
        user_address: this.params.userAddress,
      },
    })
  }
}
