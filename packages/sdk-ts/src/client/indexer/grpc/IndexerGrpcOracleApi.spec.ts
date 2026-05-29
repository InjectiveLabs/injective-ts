import { vi } from 'vitest'
import { Network, getNetworkEndpoints } from '@injectivelabs/networks'
import { IndexerGrpcOracleApi } from './IndexerGrpcOracleApi.js'
import { derivativeMarketsToOraclePriceV2Filters } from './IndexerGrpcOracleApi.js'
import type { DerivativeMarket } from '../types/index.js'

const endpoints = getNetworkEndpoints(Network.MainnetSentry)
const indexerGrpcOracleApi = new IndexerGrpcOracleApi(endpoints.indexer)

describe('IndexerGrpcOracleApi', () => {
  test('fetchOracleList', async () => {
    try {
      const response = await indexerGrpcOracleApi.fetchOracleList()

      if (response.length === 0) {
        console.warn('fetchOracleList.oracleListIsEmptyArray')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<typeof response>(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcOracleApi.fetchOracleList => ' + (e as any).message,
      )
    }
  })

  test('fetchOraclePrice', async () => {
    try {
      const response = await indexerGrpcOracleApi.fetchOraclePrice({
        baseSymbol: 'BTC',
        quoteSymbol: 'USDT',
        oracleType: 'BandIBC',
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<typeof response>(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcOracleApi.fetchOraclePrice => ' + (e as any).message,
      )
    }
  })

  test('fetchOraclePriceV2 forwards filters and transforms prices', async () => {
    const api = new IndexerGrpcOracleApi(endpoints.indexer)
    const executeGrpcCall = vi
      .spyOn(api as any, 'executeGrpcCall')
      .mockResolvedValue({
        prices: [
          {
            baseSymbol: 'BTC',
            quoteSymbol: 'USDT',
            oracleType: 'pyth',
            oracleScaleFactor: 6,
            price: '100000000',
            marketId:
              '0x17ef48032cb24375ba7c2e39f384e56433bcab20cbee9a7357e4cba2eb00abe6',
          },
          {
            baseSymbol: 'ETH',
            quoteSymbol: 'USDT',
            oracleType: 'pyth',
            oracleScaleFactor: 0,
            price: '5000000',
            marketId:
              '0xd1956f534be7b1d903c36fc45c66c9ef2f6ccea0085c2582ff79830e30504749',
          },
        ],
      })

    const response = await api.fetchOraclePriceV2([
      {
        baseSymbol: 'BTC',
        quoteSymbol: 'USDT',
        oracleType: 'pyth',
        oracleScaleFactor: 6,
      },
      {
        baseSymbol: 'ETH',
        quoteSymbol: 'USDT',
        oracleType: 'pyth',
        oracleScaleFactor: 0,
      },
    ])

    const [requestMessage] = executeGrpcCall.mock.calls[0]
    const request = requestMessage as {
      filters: Array<Record<string, unknown>>
    }

    expect(request.filters).toMatchObject([
      {
        baseSymbol: 'BTC',
        quoteSymbol: 'USDT',
        oracleType: 'pyth',
        oracleScaleFactor: 6,
      },
      {
        baseSymbol: 'ETH',
        quoteSymbol: 'USDT',
        oracleType: 'pyth',
        oracleScaleFactor: 0,
      },
    ])
    expect(response).toEqual([
      {
        baseSymbol: 'BTC',
        quoteSymbol: 'USDT',
        oracleType: 'pyth',
        oracleScaleFactor: 6,
        price: '100000000',
        marketId:
          '0x17ef48032cb24375ba7c2e39f384e56433bcab20cbee9a7357e4cba2eb00abe6',
      },
      {
        baseSymbol: 'ETH',
        quoteSymbol: 'USDT',
        oracleType: 'pyth',
        oracleScaleFactor: 0,
        price: '5000000',
        marketId:
          '0xd1956f534be7b1d903c36fc45c66c9ef2f6ccea0085c2582ff79830e30504749',
      },
    ])

    executeGrpcCall.mockRestore()
  })

  test('derivativeMarketsToOraclePriceV2Filters maps derivative markets to oracle filters', () => {
    const markets = [
      {
        oracleBase: 'BTC',
        oracleQuote: 'USDT',
        oracleType: 'pyth',
        oracleScaleFactor: 6,
      },
      {
        oracleSymbol: 'YES',
        oracleProvider: 'provider',
        oracleType: 'provider',
        oracleScaleFactor: 0,
      },
    ] as unknown as DerivativeMarket[]

    expect(derivativeMarketsToOraclePriceV2Filters(markets)).toEqual([
      {
        baseSymbol: 'BTC',
        quoteSymbol: 'USDT',
        oracleType: 'pyth',
        oracleScaleFactor: 6,
      },
    ])
  })

  test('fetchOraclePriceNoThrow', async () => {
    try {
      const response = await indexerGrpcOracleApi.fetchOraclePriceNoThrow({
        baseSymbol: 'BTC',
        quoteSymbol: 'USDT',
        oracleType: 'BandIBC',
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<typeof response>(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcOracleApi.fetchOraclePriceNoThrow => ' + (e as any).message,
      )
    }
  })
})
