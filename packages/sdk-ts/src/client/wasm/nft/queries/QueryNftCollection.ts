import { BaseWasmQuery } from '../../BaseWasmQuery'
import { toBase64 } from '../../../../utils'

export declare namespace CollectionQueryArg {
  export interface Params {}
}

export class QueryNftCollection extends BaseWasmQuery<CollectionQueryArg.Params> {
  toPayload() {
    return toBase64({
      contract_info: {},
    })
  }
}
