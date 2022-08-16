import { BaseWasmQuery } from './BaseWasmQuery'
import { toBase64 } from '../../../../utils'

export declare namespace QueryRegisteredVaultsArg {
  export interface Params {}
}
export class QueryRegisteredVaults extends BaseWasmQuery<QueryRegisteredVaultsArg.Params> {
  toPayload() {
    return toBase64({ get_registered_vaults: {} })
  }
}
