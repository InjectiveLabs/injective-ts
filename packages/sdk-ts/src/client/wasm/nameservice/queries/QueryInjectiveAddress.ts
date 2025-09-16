import { toBase64 } from '../../../../utils/index.js'
import { BaseWasmQuery } from '../../BaseWasmQuery.js'

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
