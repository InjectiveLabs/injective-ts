import * as Pb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_rfq_pricer_rpc_pb'
import { IndexerRfqPricerTransformer } from './IndexerRfqPricerTransformer.js'

describe('IndexerRfqPricerTransformer', () => {
  it.each([Pb.GetPricingResponse, Pb.PricingStreamResponse])(
    'maps pricing without losing price strings or empty sides',
    (message) => {
      const response = message.create({
        marketId: 'market',
        ts: 1700000000123n,
        markPrice: '123456789.123456789012345678',
        tiers: [
          { notionalUsd: 237n, bid: '', ask: '123.4500', ageMs: 42n },
          { notionalUsd: 900n, bid: '123.4000', ask: '', ageMs: -1n },
        ],
      })

      expect(
        IndexerRfqPricerTransformer.pricingResponseToPricing(response),
      ).toEqual({
        marketId: 'market',
        timestamp: 1700000000123,
        markPrice: '123456789.123456789012345678',
        tiers: [
          { notionalUsd: 237, bid: '', ask: '123.4500', ageMs: 42 },
          { notionalUsd: 900, bid: '123.4000', ask: '', ageMs: -1 },
        ],
      })
    },
  )

  it.each([Pb.GetPricingResponse, Pb.PricingStreamResponse])(
    'preserves empty tiers',
    (message) => {
      expect(
        IndexerRfqPricerTransformer.pricingResponseToPricing(
          message.create({ marketId: 'market', ts: 123n, markPrice: '99' }),
        ),
      ).toEqual({
        marketId: 'market',
        timestamp: 123,
        markPrice: '99',
        tiers: [],
      })
    },
  )
})
