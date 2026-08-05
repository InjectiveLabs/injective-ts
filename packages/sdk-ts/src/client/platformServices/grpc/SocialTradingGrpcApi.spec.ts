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
        positions: [
          {
            id: 'position-1',
            pnl: '1.23',
            fees: '0.1',
            side: 'long',
            state: 'closed',
            netPnl: '1.13',
            quantity: '10',
            marketId: '0xmarket',
            openedAt: '2026-07-01T00:00:00Z',
            closedAt: '2026-07-17T00:00:00Z',
            updatedAt: '2026-07-17T00:00:00Z',
            exitPrice: '101',
            sideAtOpen: 'long',
            finalMargin: '50',
            maxQuantity: '10',
            minQuantity: '1',
            closeReason: 'full_close',
            subaccountId: '0xsubaccount',
            initialMargin: '40',
            avgEntryPrice: '100',
            accountAddress,
            totalTrades: 3n,
            openedHeight: 100n,
            closedHeight: 200n,
            updatedHeight: 200n,
            numOfBuyTrades: 2n,
            numOfSellTrades: 1n,
            durationInSeconds: 3600n,
          },
        ],
      })

    const response = await socialTradingGrpcApi.fetchPositions({
      to: '2026-07-17T00:00:00Z',
      from: '2026-07-01T00:00:00Z',
      pageSize: 10,
      accountAddress,
    })
    const [request] = executeGrpcCall.mock.calls[0]

    expect(request).toMatchObject({
      to: '2026-07-17T00:00:00Z',
      from: '2026-07-01T00:00:00Z',
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
        positions: [
          expect.objectContaining({
            id: 'position-1',
            exitPrice: '101',
            totalTrades: '3',
            openedHeight: '100',
            closedHeight: '200',
            updatedHeight: '200',
            numOfBuyTrades: '2',
            numOfSellTrades: '1',
            durationInSeconds: '3600',
          }),
        ],
      }),
    )

    executeGrpcCall.mockRestore()
  })

  test('fetchPositionTrades', async () => {
    const executeGrpcCall = vi
      .spyOn(socialTradingGrpcApi as any, 'executeGrpcCall')
      .mockResolvedValue({
        nextToken: 'next',
        trades: [
          {
            pnl: '0.12',
            amount: '1.5',
            eventType: 'trade',
            positionId: 'position-1',
            timestamp: '2026-07-17T00:00:00Z',
            executionPrice: '100.5',
          },
        ],
      })

    const response = await socialTradingGrpcApi.fetchPositionTrades({
      pageSize: 10,
      nextToken: 'cursor',
      positionId: 'position-1',
    })
    const [request] = executeGrpcCall.mock.calls[0]

    expect(request).toMatchObject({
      pageSize: 10,
      nextToken: 'cursor',
      positionId: 'position-1',
    })
    expect(response).toEqual(
      expect.objectContaining<
        ReturnType<
          typeof PlatformServicesGrpcPositionsTransformer.grpcListPositionTradesToListPositionTrades
        >
      >({
        nextToken: 'next',
        trades: [
          {
            pnl: '0.12',
            amount: '1.5',
            eventType: 'trade',
            positionId: 'position-1',
            timestamp: '2026-07-17T00:00:00Z',
            executionPrice: '100.5',
          },
        ],
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
        tags: ['scalper'],
        rank: 1n,
        totalVolume: '250.25',
        maxDrawdown: '0',
        accountAddress,
        pnlPercentage: '0.12',
        closedPositions: 3n,
        avgHoldDurationInSeconds: 3600n,
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
        rank: '1',
        tags: ['scalper'],
        totalVolume: '250.25',
        tradeCount: '3',
        equityCurve: [],
        maxDrawdown: '0',
        accountAddress,
        pnlPercentage: '0.12',
        closedPositions: '3',
        avgHoldDurationInSeconds: '3600',
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

  test('fetchAccountTags', async () => {
    const executeGrpcCall = vi
      .spyOn(socialTradingGrpcApi as any, 'executeGrpcCall')
      .mockResolvedValue({
        tags: ['scalper', 'swing'],
      })

    const response = await socialTradingGrpcApi.fetchAccountTags()
    const [request] = executeGrpcCall.mock.calls[0]

    expect(request).toMatchObject({})
    expect(response).toEqual(
      expect.objectContaining<
        ReturnType<
          typeof PlatformServicesGrpcPositionsTransformer.grpcListAccountTagsToListAccountTags
        >
      >({
        tags: ['scalper', 'swing'],
      }),
    )

    executeGrpcCall.mockRestore()
  })

  test('fetchAccountCount', async () => {
    const executeGrpcCall = vi
      .spyOn(socialTradingGrpcApi as any, 'executeGrpcCall')
      .mockResolvedValue({
        totalAccounts: 123n,
      })

    const response = await socialTradingGrpcApi.fetchAccountCount()
    const [request] = executeGrpcCall.mock.calls[0]

    expect(request).toMatchObject({})
    expect(response).toEqual(
      expect.objectContaining<
        ReturnType<
          typeof PlatformServicesGrpcPositionsTransformer.grpcGetAccountCountToGetAccountCount
        >
      >({
        totalAccounts: '123',
      }),
    )

    executeGrpcCall.mockRestore()
  })

  test('fetchAccountPositionStatsList', async () => {
    const executeGrpcCall = vi
      .spyOn(socialTradingGrpcApi as any, 'executeGrpcCall')
      .mockResolvedValue({
        nextToken: 'next',
        accounts: [
          {
            pnl: '12.3',
            wins: 2n,
            losses: 1n,
            leverage: '3',
            winRate: '0.66',
            tradeCount: 3n,
            equityCurve: [],
            tags: ['scalper'],
            totalVolume: '250.25',
            maxDrawdown: '0',
            accountAddress,
            pnlPercentage: '0.12',
            closedPositions: 3n,
            avgHoldDurationInSeconds: 3600n,
          },
        ],
      })

    const response = await socialTradingGrpcApi.fetchAccountPositionStatsList({
      to: '2026-07-17T00:00:00Z',
      from: '2026-07-01T00:00:00Z',
      pageSize: 10,
      window: '30d',
      sortBy: 'pnl',
      tag: ['scalper'],
      accountAddress: [accountAddress],
      sortDirection: 'desc',
    })
    const [request] = executeGrpcCall.mock.calls[0]

    expect(request).toMatchObject({
      to: '2026-07-17T00:00:00Z',
      from: '2026-07-01T00:00:00Z',
      pageSize: 10,
      window: '30d',
      sortBy: 'pnl',
      tag: ['scalper'],
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
        accounts: [
          expect.objectContaining({
            pnl: '12.3',
            wins: '2',
            losses: '1',
            leverage: '3',
            winRate: '0.66',
            tags: ['scalper'],
            totalVolume: '250.25',
            tradeCount: '3',
            equityCurve: [],
            maxDrawdown: '0',
            accountAddress,
            pnlPercentage: '0.12',
            closedPositions: '3',
            avgHoldDurationInSeconds: '3600',
          }),
        ],
      }),
    )

    executeGrpcCall.mockRestore()
  })
})
