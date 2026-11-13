import type * as InjectiveRfqPricerRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_rfq_pricer_rpc_pb'
import type { RFQPricing } from '../types/index.js'

/**
 * @category Indexer Stream Transformer
 */
export class IndexerRfqPricerTransformer {
  static pricingResponseToPricing(
    response:
      | InjectiveRfqPricerRpcPb.GetPricingResponse
      | InjectiveRfqPricerRpcPb.PricingStreamResponse,
  ): RFQPricing {
    return {
      marketId: response.marketId,
      timestamp: Number(response.ts),
      markPrice: response.markPrice,
      tiers: response.tiers.map((tier) => ({
        notionalUsd: Number(tier.notionalUsd),
        bid: tier.bid,
        ask: tier.ask,
        ageMs: Number(tier.ageMs),
      })),
    }
  }
}
