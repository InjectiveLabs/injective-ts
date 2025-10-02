import { toBase64 } from '../../../../utils/index.js'
import { BaseWasmQuery } from '../../BaseWasmQuery.js'

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
