import { BaseWasmQuery } from '../../BaseWasmQuery.js'
import { toBase64 } from '../../../../utils/index.js'

export declare namespace QueryInputQuantityArg {
  export interface Params {
    toQuantity: string
    sourceDenom: string
    targetDenom: string
  }
}

export class QueryInputQuantity extends BaseWasmQuery<QueryInputQuantityArg.Params> {
  toPayload() {
    return toBase64({
      get_input_quantity: {
        to_quantity: this.params.toQuantity,
        source_denom: this.params.sourceDenom,
        target_denom: this.params.targetDenom,
      },
    })
  }
}
