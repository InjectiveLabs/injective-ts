import { BaseWasmQuery } from '../../BaseWasmQuery'
import { toBase64 } from '../../../../utils'

export declare namespace TokenQueryArg {
  export interface Params {
    owner: string
    limit: number
    verbose: boolean
    start_after?: string
  }
}

export class QueryNftToken extends BaseWasmQuery<TokenQueryArg.Params> {
  toPayload() {
    return toBase64({
      tokens: {
        owner: this.params.owner,
        limit: this.params.limit,
        verbose: this.params.verbose,
        start_after: this.params.start_after,
      },
    })
  }
}
