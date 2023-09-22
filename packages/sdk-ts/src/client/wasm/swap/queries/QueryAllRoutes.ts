import { BaseWasmQuery } from '../../BaseWasmQuery'
import { toBase64 } from '../../../../utils'

export declare namespace QueryAllRoutesArg {
  export interface Params {}
}

export class QueryAllRoutes extends BaseWasmQuery<QueryAllRoutesArg.Params> {
  toPayload() {
    return toBase64({ get_all_routes: {} })
  }
}
