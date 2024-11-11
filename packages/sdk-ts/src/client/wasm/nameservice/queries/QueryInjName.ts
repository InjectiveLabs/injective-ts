import { BaseWasmQuery } from '../../BaseWasmQuery.js'
import { toBase64 } from '../../../../utils/index.js'

export declare namespace QueryInjName {
  export interface Params {
    address: string
  }
}

export class QueryInjName extends BaseWasmQuery<QueryInjName.Params> {
  toPayload() {
    return toBase64({
      name: {
        address: this.params.address,
      },
    })
  }
}
