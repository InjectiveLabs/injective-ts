import { BaseWasmQuery } from './BaseWasmQuery'
import { toBase64 } from '../../../../utils'

export declare namespace QueryContractAllowanceArg {
  export interface Params {
    owner: string
    spender: string
  }
}

export class QueryContractAllowance extends BaseWasmQuery<QueryContractAllowanceArg.Params> {
  toPayload() {
    return toBase64({
      allowance: {
        owner: this.params.owner,
        spender: this.params.spender,
      },
    })
  }
}
