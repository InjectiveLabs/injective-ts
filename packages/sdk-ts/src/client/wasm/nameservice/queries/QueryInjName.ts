import { BaseWasmQuery } from '../../BaseWasmQuery'
import { toBase64 } from '../../../../utils'

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
