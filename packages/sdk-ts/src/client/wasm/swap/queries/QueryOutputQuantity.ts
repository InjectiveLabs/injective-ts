import { BaseWasmQuery } from '../../BaseWasmQuery.js'
import { toBase64 } from '../../../../utils/index.js'

export declare namespace QueryOutputQuantityArg {
  export interface Params {
    fromQuantity: string
    sourceDenom: string
    targetDenom: string
  }
}

export class QueryOutputQuantity extends BaseWasmQuery<QueryOutputQuantityArg.Params> {
  toPayload() {
    return toBase64({
      get_output_quantity: {
        from_quantity: this.params.fromQuantity,
        source_denom: this.params.sourceDenom,
        target_denom: this.params.targetDenom,
      },
    })
  }
}
