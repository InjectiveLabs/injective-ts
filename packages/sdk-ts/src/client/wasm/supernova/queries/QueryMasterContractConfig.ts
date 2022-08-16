import { BaseWasmQuery } from './BaseWasmQuery'
import { toBase64 } from '../../../../utils'

export declare namespace QueryMasterContractConfigArg {
  export interface Params {}
}

export class QueryMasterContractConfig extends BaseWasmQuery<QueryMasterContractConfigArg.Params> {
  toPayload() {
    return toBase64({ config: {} })
  }
}
