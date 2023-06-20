import { BaseWasmQuery } from '../../BaseWasmQuery'
import { toBase64 } from '../../../../utils'

export declare namespace QueryContractMarketingInfoArg {
  export interface Params {}
}

export class QueryContractMarketingInfo extends BaseWasmQuery<QueryContractMarketingInfoArg.Params> {
  toPayload() {
    return toBase64({ marketing_info: {} })
  }
}
