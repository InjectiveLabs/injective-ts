import { BaseWasmQuery } from './BaseWasmQuery'
import { toBase64 } from '../../../../utils'

export declare namespace QueryContractConfigArg {
  export interface Params {}
}

export class QueryContractConfig extends BaseWasmQuery<QueryContractConfigArg.Params> {
  toPayload() {
    return toBase64({ config: {} })
  }
}
