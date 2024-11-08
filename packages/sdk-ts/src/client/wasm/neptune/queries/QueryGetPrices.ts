import { BaseWasmQuery } from '../../BaseWasmQuery'
import { toBase64 } from '../../../../utils'
import { AssetInfo } from '../types'

export declare namespace QueryGetPrices {
  export interface Params {
    assets: AssetInfo[]
  }
}

export class QueryGetPrices extends BaseWasmQuery<QueryGetPrices.Params> {
  toPayload() {
    return toBase64({
      get_prices: {
        assets: this.params.assets,
      },
    })
  }
}
