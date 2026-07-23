import { vi } from 'vitest'
import { SocialTradingGrpcApi } from './SocialTradingGrpcApi.js'
import type { PlatformServicesGrpcPositionsTransformer } from '../transformers/index.js'

const accountAddress = 'inj1995xnrrtnmtdgjmx0g937vf28dwefhkhy6gy5e'
const socialTradingGrpcApi = new SocialTradingGrpcApi(
  'https://k8s.mainnet.platform.injective.network/grpc',
)

describe('SocialTradingGrpcApi', () => {
  test('fetchPositions', async () => {
    const executeGrpcCall = vi
      .spyOn(socialTradingGrpcApi as any, 'executeGrpcCall')
      .mockResolvedValue({
        nextToken: 'next',
        positions: [],
      })

    const response = await socialTradingGrpcApi.fetchPositions({
      pageSize: 10,
      accountAddress,
    })
    const [request] = executeGrpcCall.mock.calls[0]

    expect(request).toMatchObject({
      pageSize: 10,
      accountAddress,
    })
    expect(response).toEqual(
      expect.objectContaining<
        ReturnType<
          typeof PlatformServicesGrpcPositionsTransformer.grpcListPositionsToListPositions
        >
      >({
        nextToken: 'next',
        positions: [],
      }),
    )

    executeGrpcCall.mockRestore()
  })

  test('fetchAccountPositionStats', async () => {
    const executeGrpcCall = vi
      .spyOn(socialTradingGrpcApi as any, 'executeGrpcCall')
      .mockResolvedValue({
        pnl: '12.3',
        wins: 2n,
        losses: 1n,
        leverage: '3',
        winRate: '0.66',
        tradeCount: 3n,
        equityCurve: [],
        maxDrawdown: '0',
        accountAddress,
        pnlPercentage: '0.12',
        closedPositions: 3n,
      })

    const response = await socialTradingGrpcApi.fetchAccountPositionStats({
      accountAddress,
      window: '7d',
    })
    const [request] = executeGrpcCall.mock.calls[0]

    expect(request).toMatchObject({
      window: '7d',
      accountAddress,
    })
    expect(response).toEqual(
      expect.objectContaining<
        ReturnType<
          typeof PlatformServicesGrpcPositionsTransformer.grpcGetAccountPositionStatsToAccountPositionStats
        >
      >({
        pnl: '12.3',
        wins: '2',
        losses: '1',
        leverage: '3',
        winRate: '0.66',
        tradeCount: '3',
        equityCurve: [],
        maxDrawdown: '0',
        accountAddress,
        pnlPercentage: '0.12',
        closedPositions: '3',
      }),
    )

    executeGrpcCall.mockRestore()
  })

  test('fetchAccountDailyPNL', async () => {
    const executeGrpcCall = vi
      .spyOn(socialTradingGrpcApi as any, 'executeGrpcCall')
      .mockResolvedValue({
        accountAddress,
        dailyPnl: [{ date: '2026-07-17', pnl: '1.23' }],
      })

    const response = await socialTradingGrpcApi.fetchAccountDailyPNL({
      accountAddress,
      from: '2026-07-01',
      to: '2026-07-17',
    })
    const [request] = executeGrpcCall.mock.calls[0]

    expect(request).toMatchObject({
      accountAddress,
      from: '2026-07-01',
      to: '2026-07-17',
    })
    expect(response.dailyPnl).toEqual([{ date: '2026-07-17', pnl: '1.23' }])

    executeGrpcCall.mockRestore()
  })

  test('fetchAccountPositionStatsList', async () => {
    const executeGrpcCall = vi
      .spyOn(socialTradingGrpcApi as any, 'executeGrpcCall')
      .mockResolvedValue({
        nextToken: 'next',
        accounts: [],
      })

    const response = await socialTradingGrpcApi.fetchAccountPositionStatsList({
      pageSize: 10,
      window: '30d',
      sortBy: 'pnl',
      accountAddress: [accountAddress],
      sortDirection: 'desc',
    })
    const [request] = executeGrpcCall.mock.calls[0]

    expect(request).toMatchObject({
      pageSize: 10,
      window: '30d',
      sortBy: 'pnl',
      accountAddress: [accountAddress],
      sortDirection: 'desc',
    })
    expect(response).toEqual(
      expect.objectContaining<
        ReturnType<
          typeof PlatformServicesGrpcPositionsTransformer.grpcListAccountPositionStatsToListAccountPositionStats
        >
      >({
        nextToken: 'next',
        accounts: [],
      }),
    )

    executeGrpcCall.mockRestore()
  })
})
