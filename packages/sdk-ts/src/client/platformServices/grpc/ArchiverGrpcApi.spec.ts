import { vi } from 'vitest'
import * as PlatformServicesArchiverPb from '@injectivelabs/platform-services-proto-ts-v2/generated/goagen_api_injective_archiver_rpc_pb'
import { InjectiveArchiverRPCClient } from '@injectivelabs/platform-services-proto-ts-v2/generated/goagen_api_injective_archiver_rpc_pb.client'
import { ArchiverGrpcApi } from './ArchiverGrpcApi.js'

const accountAddress = 'inj1995xnrrtnmtdgjmx0g937vf28dwefhkhy6gy5e'
const api = new ArchiverGrpcApi(
  'https://k8s.mainnet.platform.injective.network/grpc',
)

describe('ArchiverGrpcApi', () => {
  test('fetchBalance', async () => {
    const executeGrpcCall = vi
      .spyOn(api as any, 'executeGrpcCall')
      .mockResolvedValue({
        historicalBalance: {
          t: [1_700_000_000],
          v: [100],
          dv: [{ spot: 80, perp: 10, staking: 10 }],
        },
      })

    const response = await api.fetchBalance({
      account: 'inj1995xnrrtnmtdgjmx0g937vf28dwefhkhy6gy5e',
      resolution: '1D',
    })

    expect(executeGrpcCall.mock.calls[0][0]).toMatchObject({
      account: 'inj1995xnrrtnmtdgjmx0g937vf28dwefhkhy6gy5e',
      resolution: '1D',
    })
    expect(response.historicalBalance).toMatchObject({ v: [100] })
    executeGrpcCall.mockRestore()
  })

  test('fetchAccountStats', async () => {
    const executeGrpcCall = vi
      .spyOn(api as any, 'executeGrpcCall')
      .mockResolvedValue({
        pnl: 10,
        volume: 100,
        stake: '20',
        maxDrawdown: 25,
        maxDrawdownPercentage: 0.12,
        account: 'inj1995xnrrtnmtdgjmx0g937vf28dwefhkhy6gy5e',
      })

    const response = await api.fetchAccountStats({
      account: 'inj1995xnrrtnmtdgjmx0g937vf28dwefhkhy6gy5e',
      period: '30d',
    })

    expect(executeGrpcCall.mock.calls[0][0]).toMatchObject({ period: '30d' })
    expect(response).toMatchObject({
      pnl: 10,
      volume: 100,
      maxDrawdown: 25,
      maxDrawdownPercentage: 0.12,
    })
    executeGrpcCall.mockRestore()
  })

  test('fetchAccountStats preserves generated default drawdown values', async () => {
    const executeGrpcCall = vi
      .spyOn(api as any, 'executeGrpcCall')
      .mockResolvedValue(
        PlatformServicesArchiverPb.AccountStatsResponse.create(),
      )

    try {
      expect(await api.fetchAccountStats({ account: 'inj1account' })).toEqual({
        account: '',
        pnl: 0,
        volume: 0,
        stake: '',
        maxDrawdown: 0,
        maxDrawdownPercentage: 0,
      })
    } finally {
      executeGrpcCall.mockRestore()
    }
  })

  test.each([false, true])(
    'fetchAccountMaxDrawdown dispatches through the current transport (setMetadata: %s)',
    async (setMetadata) => {
      const archiverEndpoint = 'https://archiver.example/grpc'
      const options = { meta: { authorization: 'original' }, timeout: 5000 }
      const metadata = { authorization: 'updated' }
      const archiverApi = new ArchiverGrpcApi(archiverEndpoint, options)
      const originalTransport = archiverApi.getTransport()
      const originalClient = (archiverApi as any).client

      if (setMetadata) {
        archiverApi.setMetadata(metadata)
      }

      const transport = archiverApi.getTransport()
      const unary = vi.spyOn(transport, 'unary').mockImplementation(() => {
        return Promise.resolve({
          response: PlatformServicesArchiverPb.ListAccountStatsResponse.create(),
        }) as any
      })
      const executeGrpcCall = vi.spyOn(archiverApi as any, 'executeGrpcCall')
      const listAccountStats = vi.spyOn(
        InjectiveArchiverRPCClient.prototype,
        'listAccountStats',
      )

      try {
        const requestParams = {
          account: [accountAddress, 'inj1second'],
          period: '1M',
          pageSize: 10,
          nextToken: 'cursor',
        }

        expect(await archiverApi.fetchAccountMaxDrawdown(requestParams)).toEqual({
          stats: [],
          nextToken: undefined,
        })
        expect(listAccountStats).toHaveBeenCalledTimes(1)
        expect(listAccountStats.mock.calls[0][0]).toEqual(
          PlatformServicesArchiverPb.ListAccountStatsRequest.create(
            requestParams,
          ),
        )
        expect(listAccountStats.mock.contexts[0]).toBe((archiverApi as any).client)
        expect(listAccountStats.mock.contexts[0] === originalClient).toBe(
          !setMetadata,
        )
        expect(executeGrpcCall).toHaveBeenCalledTimes(1)
        expect((archiverApi as any).endpoint).toBe(archiverEndpoint)
        expect(transport === originalTransport).toBe(!setMetadata)
        expect(unary).toHaveBeenCalledTimes(1)
        expect(unary.mock.calls[0][0].localName).toBe('listAccountStats')
        expect(unary.mock.calls[0][1]).toEqual(
          PlatformServicesArchiverPb.ListAccountStatsRequest.create(
            requestParams,
          ),
        )
        expect(unary.mock.calls[0][2]).toMatchObject({
          meta: setMetadata ? metadata : options.meta,
          timeout: options.timeout,
        })
      } finally {
        listAccountStats.mockRestore()
        executeGrpcCall.mockRestore()
        unary.mockRestore()
      }
    },
  )

  test('fetchAccountMaxDrawdown forwards account filters and preserves precision and generated defaults', async () => {
    const stats = [
      PlatformServicesArchiverPb.AccountStatsEntry.create({
        account: accountAddress,
        pnl: -10.123456789012345,
        volume: 100.12345678901234,
        stake: '20.123456789012345678901234567890',
        maxDrawdown: 25.123456789012345,
        maxDrawdownPercentage: 0.123456789012345,
      }),
      PlatformServicesArchiverPb.AccountStatsEntry.create({
        account: 'inj1second',
      }),
    ]
    const executeGrpcCall = vi
      .spyOn(api as any, 'executeGrpcCall')
      .mockResolvedValue(
        PlatformServicesArchiverPb.ListAccountStatsResponse.create({ stats }),
      )

    try {
      const params = { account: [accountAddress, 'inj1second'], period: '1M' }
      const response = await api.fetchAccountMaxDrawdown(params)

      expect(executeGrpcCall).toHaveBeenCalledTimes(1)
      expect(executeGrpcCall.mock.calls[0][0]).toEqual(
        PlatformServicesArchiverPb.ListAccountStatsRequest.create(params),
      )
      expect(response).toEqual({ stats, nextToken: undefined })
      expect(response.stats[1]).toEqual({
        account: 'inj1second',
        pnl: 0,
        volume: 0,
        stake: '',
        maxDrawdown: 0,
        maxDrawdownPercentage: 0,
      })
    } finally {
      executeGrpcCall.mockRestore()
    }
  })

  test('fetchAccountMaxDrawdown preserves pagination and defaults omitted optional fields', async () => {
    const executeGrpcCall = vi
      .spyOn(api as any, 'executeGrpcCall')
      .mockResolvedValueOnce(
        PlatformServicesArchiverPb.ListAccountStatsResponse.create({
          nextToken: 'next',
        }),
      )
      .mockResolvedValueOnce(
        PlatformServicesArchiverPb.ListAccountStatsResponse.create(),
      )

    try {
      const params = {
        account: [accountAddress],
        period: '1M',
        pageSize: 10,
        nextToken: 'cursor',
      }

      expect(await api.fetchAccountMaxDrawdown(params)).toEqual({
        stats: [],
        nextToken: 'next',
      })
      expect(executeGrpcCall.mock.calls[0][0]).toEqual(
        PlatformServicesArchiverPb.ListAccountStatsRequest.create(params),
      )
      expect(
        await api.fetchAccountMaxDrawdown({
          account: [accountAddress],
        }),
      ).toEqual({ stats: [], nextToken: undefined })
      expect(executeGrpcCall.mock.calls[1][0]).toEqual(
        PlatformServicesArchiverPb.ListAccountStatsRequest.create({
          account: [accountAddress],
        }),
      )
    } finally {
      executeGrpcCall.mockRestore()
    }
  })

  test('fetchRpnl', async () => {
    const executeGrpcCall = vi
      .spyOn(api as any, 'executeGrpcCall')
      .mockResolvedValue({
        historicalRpnl: {
          t: [1_700_000_000],
          v: [10],
          dv: [{ rpnl: 7, upnl: 3 }],
        },
      })

    const response = await api.fetchRpnl({
      account: 'inj1995xnrrtnmtdgjmx0g937vf28dwefhkhy6gy5e',
    })

    expect(executeGrpcCall.mock.calls[0][0]).toMatchObject({
      account: 'inj1995xnrrtnmtdgjmx0g937vf28dwefhkhy6gy5e',
    })
    expect(response.historicalRpnl).toMatchObject({ v: [10] })
    executeGrpcCall.mockRestore()
  })

  test('fetchHistoricalTrades', async () => {
    const executeGrpcCall = vi
      .spyOn(api as any, 'executeGrpcCall')
      .mockResolvedValue({
        trades: [
          {
            cid: 'cid',
            fee: '1',
            flags: [],
            account: 'inj1account',
            tradeId: 'trade-id',
            marketId: '0xmarket',
            usdValue: '10',
            fundingRate: '0',
            marketType: 'spot',
            executionSide: 'taker',
            feeRecipient: 'inj1fee',
            subaccountId: '0xsubaccount',
            tradeDirection: 'buy',
            executionType: 'market',
            executedAt: 1_700_000_000n,
            executedHeight: 100n,
            price: { price: '10', quantity: '1', timestamp: 1_700_000_000n },
          },
        ],
        lastHeight: 100n,
        lastTime: 1_700_000_000n,
        next: ['next'],
      })

    const response = await api.fetchHistoricalTrades({
      account: 'inj1account',
      perPage: 10,
      executionTypes: ['market'],
    })

    expect(executeGrpcCall.mock.calls[0][0]).toMatchObject({
      account: 'inj1account',
      perPage: 10,
      executionTypes: ['market'],
    })
    expect(response).toMatchObject({ lastHeight: '100', next: ['next'] })
    expect(response.trades[0]).toMatchObject({ executedAt: '1700000000' })
    executeGrpcCall.mockRestore()
  })
})
