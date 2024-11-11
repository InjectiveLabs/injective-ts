import { BaseWasmQuery } from '../../BaseWasmQuery.js'
import { toBase64 } from '../../../../utils/index.js'

export declare namespace QueryRouteArg {
  export interface Params {
    sourceDenom: string
    targetDenom: string
  }
}

export class QueryRoute extends BaseWasmQuery<QueryRouteArg.Params> {
  toPayload() {
    return toBase64({
      get_route: {
        source_denom: this.params.sourceDenom,
        target_denom: this.params.targetDenom,
      },
    })
  }
}
