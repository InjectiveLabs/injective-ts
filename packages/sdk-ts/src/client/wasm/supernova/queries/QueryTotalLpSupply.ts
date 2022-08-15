import { BaseWasmQuery } from './BaseWasmQuery'
import {
  QueryTotalLpSupplyPayload,
  QueryTotalLpSupplyResponse,
  TotalLpSupply,
} from '../types'

export class QueryTotalLpSupply extends BaseWasmQuery {
  toPayload(payload: QueryTotalLpSupplyPayload) {
    return this.encodeToBase64({
      get_total_lp_supply: {
        subaccount_id: payload.subaccountId,
      },
    })
  }

  toData({ data }: { data: string }): TotalLpSupply {
    const response = this.decodeFromBase64(data) as QueryTotalLpSupplyResponse

    return { totalSupply: response.total_supply }
  }
}
