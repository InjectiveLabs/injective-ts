import { BaseWasmQuery } from './BaseWasmQuery'
import {
  QueryUserLpBalancePayload,
  QueryUserLpBalanceResponse,
  UserLpBalance,
} from '../types'

export class QueryUserLpBalance extends BaseWasmQuery {
  toPayload(payload: QueryUserLpBalancePayload) {
    return this.encodeToBase64({
      get_user_lp_balance: {
        subaccount_id: payload.subaccountId,
        user_address: payload.userAddress,
      },
    })
  }

  toData({ data }: { data: string }): UserLpBalance {
    const response = this.decodeFromBase64(data) as QueryUserLpBalanceResponse

    return { balance: response.balance }
  }
}
