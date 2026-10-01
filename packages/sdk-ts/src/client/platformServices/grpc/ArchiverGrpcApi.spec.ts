import { vi } from 'vitest'
import { ArchiverGrpcApi } from './ArchiverGrpcApi.js'

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
        account: 'inj1995xnrrtnmtdgjmx0g937vf28dwefhkhy6gy5e',
      })

    const response = await api.fetchAccountStats({
      account: 'inj1995xnrrtnmtdgjmx0g937vf28dwefhkhy6gy5e',
      period: '30d',
    })

    expect(executeGrpcCall.mock.calls[0][0]).toMatchObject({ period: '30d' })
    expect(response).toMatchObject({ pnl: 10, volume: 100 })
    executeGrpcCall.mockRestore()
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
