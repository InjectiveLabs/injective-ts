import * as InjectiveExchangeV2QueryPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/query_pb'
import * as InjectiveExchangeV2MarketPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/market_pb'
import { ChainGrpcExchangeTransformerV2 } from './ChainGrpcExchangeTransformerV2.js'

const fullDerivativeMarket = (
  market: Partial<InjectiveExchangeV2MarketPb.DerivativeMarket>,
  perpetualMarketInfo?: Partial<InjectiveExchangeV2MarketPb.PerpetualMarketInfo>,
) =>
  InjectiveExchangeV2QueryPb.FullDerivativeMarket.create({
    market: InjectiveExchangeV2MarketPb.DerivativeMarket.create({
      marketId: '0xmarket',
      isPerpetual: true,
      ...market,
    }),
    info: perpetualMarketInfo
      ? {
          oneofKind: 'perpetualInfo',
          perpetualInfo: InjectiveExchangeV2QueryPb.PerpetualMarketState.create(
            {
              marketInfo:
                InjectiveExchangeV2MarketPb.PerpetualMarketInfo.create(
                  perpetualMarketInfo,
                ),
            },
          ),
        }
      : { oneofKind: undefined },
  })

describe('ChainGrpcExchangeTransformerV2 (chain v1.21 fields)', () => {
  describe('grpcFullDerivativeMarketToDerivativeMarket', () => {
    it('maps syntheticTradeFeeRate, referencePriceGateConfig and fundingImpactNotional', () => {
      const market =
        ChainGrpcExchangeTransformerV2.grpcFullDerivativeMarketToDerivativeMarket(
          fullDerivativeMarket(
            {
              syntheticTradeFeeRate: '0.001',
              referencePriceGateConfig: {
                referencePriceSource:
                  InjectiveExchangeV2MarketPb.ReferencePriceSource
                    .PYTH_EMA_LONG,
                referenceWindowSeconds: 60,
                maxOpenDeviationBps: 25,
              },
            },
            { fundingImpactNotional: '1000' },
          ),
        ) as any

      expect(market.syntheticTradeFeeRate).toBe('0.001')
      expect(market.referencePriceGateConfig).toStrictEqual({
        referencePriceSource: 1,
        referenceWindowSeconds: 60,
        maxOpenDeviationBps: 25,
      })
      expect(market.perpetualMarketInfo.fundingImpactNotional).toBe('1000')
    })

    it('leaves the gate config undefined and defaults fundingImpactNotional to 0 when absent', () => {
      const market =
        ChainGrpcExchangeTransformerV2.grpcFullDerivativeMarketToDerivativeMarket(
          fullDerivativeMarket({}),
        ) as any

      expect(market.referencePriceGateConfig).toBeUndefined()
      expect(market.syntheticTradeFeeRate).toBe('')
      expect(market.perpetualMarketInfo.fundingImpactNotional).toBe('0')
    })
  })

  it('maps fundingImpactNotional on the perpetual market info', () => {
    const { info } =
      ChainGrpcExchangeTransformerV2.perpetualMarketInfoResponseToPerpetualMarketInfo(
        InjectiveExchangeV2QueryPb.QueryPerpetualMarketInfoResponse.create({
          info: InjectiveExchangeV2MarketPb.PerpetualMarketInfo.create({
            marketId: '0xmarket',
            fundingImpactNotional: '1000',
          }),
        }),
      )

    expect(info?.fundingImpactNotional).toBe('1000')
  })

  it('maps periodStart, lastPremium and lastSampleTimestamp on the funding state', () => {
    const { state } =
      ChainGrpcExchangeTransformerV2.perpetualMarketFundingResponseToPerpetualMarketFunding(
        InjectiveExchangeV2QueryPb.QueryPerpetualMarketFundingResponse.create({
          state: InjectiveExchangeV2MarketPb.PerpetualMarketFunding.create({
            lastTimestamp: 1n,
            periodStart: 2n,
            lastPremium: '0.01',
            lastSampleTimestamp: 3n,
          }),
        }),
      )

    expect(state).toMatchObject({
      lastTimestamp: 1,
      periodStart: 2,
      lastPremium: '0.01',
      lastSampleTimestamp: 3,
    })
  })

  it('maps the new cross margin pool snapshot fields', () => {
    const snapshot =
      ChainGrpcExchangeTransformerV2.crossMarginPoolSnapshotResponseToCrossMarginPoolSnapshot(
        InjectiveExchangeV2QueryPb.QueryCrossMarginPoolSnapshotResponse.create({
          ratchetedMaintenanceMarginTotal: '1',
          crossMarginUtilRatio: '2',
          positionOrderLockRequirement: '3',
          nonPositionOrderLockRequirement: '4',
        }),
      )

    expect(snapshot).toMatchObject({
      ratchetedMaintenanceMarginTotal: '1',
      crossMarginUtilRatio: '2',
      positionOrderLockRequirement: '3',
      nonPositionOrderLockRequirement: '4',
    })
  })
})
