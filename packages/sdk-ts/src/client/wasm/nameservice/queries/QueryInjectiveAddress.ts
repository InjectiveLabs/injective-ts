import { BaseWasmQuery } from '../../BaseWasmQuery'
import { toBase64 } from '../../../../utils'

export declare namespace QueryInjectiveAddress {
  export interface Params {
    node: number[]
  }
}

export class QueryInjectiveAddress extends BaseWasmQuery<QueryInjectiveAddress.Params> {
  toPayload() {
    return toBase64({
      address: {
        node: this.params.node,
      },
    })
  }
}
