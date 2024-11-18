import { BaseWasmQuery } from '../../BaseWasmQuery.js';
import { toBase64 } from '../../../../utils/index.js';
import { AssetInfo } from '../types.js';

export declare namespace QueryGetAllLendingRates {
  export interface Params {
    limit?: number;
    startAfter?: AssetInfo;
  }
}

export class QueryGetAllLendingRates extends BaseWasmQuery<QueryGetAllLendingRates.Params> {
  toPayload() {
    const payload = {
      get_all_lending_rates: {
        ...(this.params.limit !== undefined ? { limit: this.params.limit } : {}),
        ...(this.params.startAfter ? { start_after: this.params.startAfter } : {}),
      },
    };

    return toBase64(payload);
  }
}
