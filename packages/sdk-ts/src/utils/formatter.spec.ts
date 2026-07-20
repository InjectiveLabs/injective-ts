import { toOpenNotionalCap } from './formatter.js'
import type * as InjectiveExchangeV2MarketPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/market_pb'

describe('formatter', () => {
  describe('toOpenNotionalCap', () => {
    it('handles missing cap', () => {
      expect(
        toOpenNotionalCap({} as InjectiveExchangeV2MarketPb.OpenNotionalCap),
      ).toStrictEqual({})
    })
  })
})
