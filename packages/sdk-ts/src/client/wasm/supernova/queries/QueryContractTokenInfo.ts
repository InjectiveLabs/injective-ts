import { BaseWasmQuery } from './BaseWasmQuery'
import { toBase64 } from '../../../../utils'

export declare namespace QueryContractTokenInfoArg {
  export interface Params {}
}

export class QueryContractTokenInfo extends BaseWasmQuery<QueryContractTokenInfoArg.Params> {
  toPayload() {
    return toBase64({ token_info: {} })
  }
}
