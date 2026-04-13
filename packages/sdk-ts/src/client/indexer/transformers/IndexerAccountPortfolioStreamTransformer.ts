import type * as InjectivePortfolioRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_portfolio_rpc_pb'

/**
 * @category Indexer Stream Transformer
 */
export class IndexerAccountPortfolioStreamTransformer {
  static accountPortfolioStreamCallback = (
    response: InjectivePortfolioRpcPb.StreamAccountPortfolioResponse,
  ) => {
    return {
      type: response.type,
      denom: response.denom,
      amount: response.amount,
      subaccountId: response.subaccountId,
    }
  }
}
