import { BaseWasmQuery } from '../../BaseWasmQuery'
import { toBase64 } from '../../../../utils'

export declare namespace QueryExecutionQuantityArg {
  export interface Params {
    fromQuantity: string
    sourceDenom: string
    targetDenom: string
  }
}

export class QueryExecutionQuantity extends BaseWasmQuery<QueryExecutionQuantityArg.Params> {
  toPayload() {
    return toBase64({
      get_execution_quantity: {
        from_quantity: this.params.fromQuantity,
        source_denom: this.params.sourceDenom,
        target_denom: this.params.targetDenom,
      },
    })
  }
}
