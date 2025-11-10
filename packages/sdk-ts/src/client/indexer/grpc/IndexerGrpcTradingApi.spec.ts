import { Network, getNetworkEndpoints } from '@injectivelabs/networks'
import { MarketType, GridStrategyType } from '../types/index.js'
import { IndexerGrpcTradingApi } from './IndexerGrpcTradingApi.js'
import type { InjectiveTradingRpcPb } from '@injectivelabs/indexer-proto-ts-v2'

const endpoints = getNetworkEndpoints(Network.Mainnet)
const indexerGrpcTradingApi = new IndexerGrpcTradingApi(endpoints.indexer)

describe('IndexerGrpcTradingApi', () => {
  test('fetchTradingStats', async () => {
    try {
      const response = await indexerGrpcTradingApi.fetchTradingStats()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<InjectiveTradingRpcPb.GetTradingStatsResponse>(
          response,
        ),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcTradingApi.fetchTradingStats => ' + (e as any).message,
      )
    }
  })

  test('fetchGridStrategies', async () => {
    try {
      const response = await indexerGrpcTradingApi.fetchGridStrategies({
        limit: 10,
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<InjectiveTradingRpcPb.ListTradingStrategiesResponse>(
          response,
        ),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcTradingApi.fetchGridStrategies => ' + (e as any).message,
      )
    }
  })

  test('fetchGridStrategies with filters', async () => {
    try {
      const response = await indexerGrpcTradingApi.fetchGridStrategies({
        accountAddress: 'inj17gkuet8f6pssxd8nycm3qr9d9y699rupv6397z',
        marketId:
          '0x0611780ba69656949525013d9e736da677424a3d76c6461fa961a678cfda6680',
        marketType: MarketType.Spot,
        strategyType: [GridStrategyType.Geometric],
        state: 'active',
        limit: 5,
        skip: 0,
        withTvl: true,
        withPerformance: true,
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<InjectiveTradingRpcPb.ListTradingStrategiesResponse>(
          response,
        ),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcTradingApi.fetchGridStrategies with filters => ' +
          (e as any).message,
      )
    }
  })
})
