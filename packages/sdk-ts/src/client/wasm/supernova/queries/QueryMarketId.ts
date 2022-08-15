import { BaseWasmQuery } from './BaseWasmQuery'
import { QueryMarketIdPayload, MarketId, QueryMarketIdResponse } from '../types'

export class QueryMarketId extends BaseWasmQuery {
  toPayload(payload: QueryMarketIdPayload) {
    return this.encodeToBase64({
      get_market_id: {
        subaccount_id: payload.subaccountId,
      },
    })
  }

  toData({ data }: { data: string }): MarketId {
    const response = this.decodeFromBase64(data) as QueryMarketIdResponse

    return { marketId: response.market_id }
  }
}
