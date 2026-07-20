import { toOpenNotionalCap } from './openNotionalCap.js'
import type * as InjectiveExchangeV2MarketPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/market_pb'

describe('toOpenNotionalCap', () => {
  it('returns undefined when not provided', () => {
    expect(toOpenNotionalCap()).toBeUndefined()
  })

  it('throws when cap is missing', () => {
    expect(() =>
      toOpenNotionalCap({} as InjectiveExchangeV2MarketPb.OpenNotionalCap),
    ).toThrow('Invalid OpenNotionalCap: missing cap union value')
  })

  it('returns uncapped when the proto union is uncapped', () => {
    expect(
      toOpenNotionalCap({
        cap: {
          oneofKind: 'uncapped',
          uncapped: {},
        },
      }),
    ).toStrictEqual({
      uncapped: {},
    })
  })

  it('formats capped values when the proto union is capped', () => {
    expect(
      toOpenNotionalCap(
        {
          cap: {
            oneofKind: 'capped',
            capped: {
              value: '1000',
            },
          },
        },
        (value) => `formatted:${value}`,
      ),
    ).toStrictEqual({
      capped: {
        value: 'formatted:1000',
      },
    })
  })

  it('throws when the cap union kind is unsupported', () => {
    expect(() =>
      toOpenNotionalCap({
        cap: {
          oneofKind: 'unknown' as never,
        } as InjectiveExchangeV2MarketPb.OpenNotionalCap['cap'],
      }),
    ).toThrow('Invalid OpenNotionalCap: unsupported cap kind unknown')
  })
})
