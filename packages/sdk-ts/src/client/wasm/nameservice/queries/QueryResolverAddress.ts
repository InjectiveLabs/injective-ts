import { BaseWasmQuery } from '../../BaseWasmQuery'
import { toBase64 } from '../../../../utils'

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
