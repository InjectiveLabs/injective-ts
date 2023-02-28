import { StreamAccountPortfolioResponse } from '@injectivelabs/indexer-proto-ts/injective_portfolio_rpc'

/**
 * @category Indexer Stream Transformer
 */
export class IndexerAccountPortfolioStreamTransformer {
  static accountPortfolioStreamCallback = (
    response: StreamAccountPortfolioResponse,
  ) => {
    return {
      type: response.type,
      denom: response.denom,
      amount: response.amount,
      subaccountId: response.subaccountId,
    }
  }
}
