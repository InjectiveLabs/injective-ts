import { StreamAccountPortfolioResponse } from '@injectivelabs/indexer-api/injective_portfolio_rpc_pb'

/**
 * @category Indexer Stream Transformer
 */
export class IndexerAccountPortfolioStreamTransformer {
  static accountPortfolioStreamCallback = (response: StreamAccountPortfolioResponse) => {
    return {
      type: response.getType(),
      denom: response.getDenom(),
      amount: response.getAmount(),
      subaccountId: response.getSubaccountId(),
    }
  }
}
