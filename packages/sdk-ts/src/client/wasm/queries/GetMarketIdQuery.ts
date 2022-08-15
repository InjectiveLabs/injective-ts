import { BaseWasmQuery } from './BaseWasmQuery'
import { GetMarketIdPayload, MarketId, GetMarketIdResponse } from '../types'

export class GetMarketIdQuery extends BaseWasmQuery {
  toPayload(payload: GetMarketIdPayload) {
    return this.encodeToBase64({
      get_market_id: {
        subaccount_id: payload.subaccountId,
      },
    })
  }

  toData({ data }: { data: string }): MarketId {
    const response = this.decodeFromBase64(data) as GetMarketIdResponse

    return { marketId: response.market_id }
  }
}
