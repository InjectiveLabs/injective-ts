import { BaseWasmQuery } from './BaseWasmQuery'
import {
  GetUserLpBalancePayload,
  GetUserLpBalanceResponse,
  UserLpBalance,
} from './../types'

export class GetUserLpBalanceQuery extends BaseWasmQuery {
  toPayload(payload: GetUserLpBalancePayload) {
    return this.encodeToBase64({
      get_user_lp_balance: {
        subaccount_id: payload.subaccountId,
        user_address: payload.userAddress,
      },
    })
  }

  toData({ data }: { data: string }): UserLpBalance {
    const response = this.decodeFromBase64(data) as GetUserLpBalanceResponse

    return { balance: response.balance }
  }
}
