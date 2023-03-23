import { InjectivePortfolioRpc } from '@injectivelabs/indexer-proto-ts'

/**
 * @category Indexer Stream Transformer
 */
export class IndexerAccountPortfolioStreamTransformer {
  static accountPortfolioStreamCallback = (
    response: InjectivePortfolioRpc.StreamAccountPortfolioResponse,
  ) => {
    return {
      type: response.type,
      denom: response.denom,
      amount: response.amount,
      subaccountId: response.subaccountId,
    }
  }
}
