import { vi } from 'vitest'
import { ChartsTradingViewGrpcApi } from './ChartsTradingViewGrpcApi.js'

const api = new ChartsTradingViewGrpcApi(
  'https://k8s.mainnet.platform.injective.network/grpc',
)

const marketHistory = {
  s: 'ok',
  t: [1_700_000_000],
  o: [10],
  h: [12],
  l: [9],
  c: [11],
  v: [100],
}

describe('ChartsTradingViewGrpcApi', () => {
  test('fetchDerivativeMarketHistory', async () => {
    const executeGrpcCall = vi
      .spyOn(api as any, 'executeGrpcCall')
      .mockResolvedValue(marketHistory)

    const response = await api.fetchDerivativeMarketHistory({
      to: 1_700_000_060,
      resolution: '1',
      marketId: '0xmarket',
    })

    expect(executeGrpcCall.mock.calls[0][0]).toMatchObject({
      to: 1_700_000_060,
      resolution: '1',
      marketId: '0xmarket',
    })
    expect(response).toEqual(marketHistory)
    executeGrpcCall.mockRestore()
  })

  test('fetchSpotMarketHistory', async () => {
    const executeGrpcCall = vi
      .spyOn(api as any, 'executeGrpcCall')
      .mockResolvedValue(marketHistory)

    const response = await api.fetchSpotMarketHistory({
      to: 1_700_000_060,
      resolution: '1',
      symbol: 'INJ/USDT',
      fillGaps: true,
    })

    expect(executeGrpcCall.mock.calls[0][0]).toMatchObject({
      to: 1_700_000_060,
      resolution: '1',
      symbol: 'INJ/USDT',
      fillGaps: true,
    })
    expect(response).toEqual(marketHistory)
    executeGrpcCall.mockRestore()
  })

  test('fetchSpotMarketSummary', async () => {
    const executeGrpcCall = vi
      .spyOn(api as any, 'executeGrpcCall')
      .mockResolvedValue({
        marketId: '0xmarket',
        open: 10,
        high: 12,
        low: 9,
        volume: 100,
        price: 11,
        change: 0.1,
      })

    const response = await api.fetchSpotMarketSummary({
      marketId: '0xmarket',
      resolution: '1D',
    })

    expect(executeGrpcCall.mock.calls[0][0]).toMatchObject({
      marketId: '0xmarket',
      resolution: '1D',
    })
    expect(response).toMatchObject({ marketId: '0xmarket', price: 11 })
    executeGrpcCall.mockRestore()
  })

  test('fetchAllSpotMarketSummaries', async () => {
    const executeGrpcCall = vi
      .spyOn(api as any, 'executeGrpcCall')
      .mockResolvedValue({
        field: [
          {
            marketId: '0xmarket',
            open: 10,
            high: 12,
            low: 9,
            volume: 100,
            price: 11,
            change: 0.1,
          },
        ],
      })

    const response = await api.fetchAllSpotMarketSummaries({ resolution: '1D' })

    expect(executeGrpcCall.mock.calls[0][0]).toMatchObject({
      resolution: '1D',
    })
    expect(response).toHaveLength(1)
    expect(response[0]).toMatchObject({ marketId: '0xmarket', price: 11 })
    executeGrpcCall.mockRestore()
  })
})
