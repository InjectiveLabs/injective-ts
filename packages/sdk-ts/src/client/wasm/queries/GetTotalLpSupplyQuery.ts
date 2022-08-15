import { BaseWasmQuery } from './BaseWasmQuery'
import {
  GetTotalLpSupplyPayload,
  GetTotalLpSupplyResponse,
  TotalLpSupply,
} from './../types'

export class GetTotalLpSupplyQuery extends BaseWasmQuery {
  toPayload(payload: GetTotalLpSupplyPayload) {
    return this.encodeToBase64({
      get_total_lp_supply: {
        subaccount_id: payload.subaccountId,
      },
    })
  }

  toData({ data }: { data: string }): TotalLpSupply {
    const response = this.decodeFromBase64(data) as GetTotalLpSupplyResponse

    return { totalSupply: response.total_supply }
  }
}
