import { toBase64 } from '../../../../utils/index.js'
import { BaseWasmQuery } from '../../BaseWasmQuery.js'

export declare namespace QueryResolverAddress {
  export interface Params {
    node: number[]
  }
}

export class QueryResolverAddress extends BaseWasmQuery<QueryResolverAddress.Params> {
  toPayload() {
    return toBase64({
      resolver: {
        node: this.params.node,
      },
    })
  }
}
