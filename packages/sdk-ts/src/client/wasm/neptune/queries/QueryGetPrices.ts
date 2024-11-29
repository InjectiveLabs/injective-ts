import { BaseWasmQuery } from '../../BaseWasmQuery.js'
import { toBase64 } from '../../../../utils/index.js'
import { AssetInfo } from '../types.js'

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
