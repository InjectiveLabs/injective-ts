import { BaseWasmQuery } from '../../BaseWasmQuery.js'
import { toBase64 } from '../../../../utils/index.js'

export declare namespace QueryAllRoutesArg {
  export interface Params {}
}

export class QueryAllRoutes extends BaseWasmQuery<QueryAllRoutesArg.Params> {
  toPayload() {
    return toBase64({ get_all_routes: {} })
  }
}
