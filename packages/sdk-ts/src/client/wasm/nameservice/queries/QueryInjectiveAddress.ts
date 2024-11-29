import { BaseWasmQuery } from '../../BaseWasmQuery.js'
import { toBase64 } from '../../../../utils/index.js'

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
