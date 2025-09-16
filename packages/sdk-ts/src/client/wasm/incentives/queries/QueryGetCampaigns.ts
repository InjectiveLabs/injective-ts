import { toBase64 } from '../../../../utils/index.js'
import { BaseWasmQuery } from '../../BaseWasmQuery.js'

export declare namespace QueryGetCampaignsArg {
  export interface Params {
    campaigns: string[]
  }
}

export class QueryGetCampaigns extends BaseWasmQuery<QueryGetCampaignsArg.Params> {
  toPayload() {
    const payload = {
      get_campaigns: {
        campaigns: this.params.campaigns,
      },
    }

    return toBase64(payload)
  }
}
