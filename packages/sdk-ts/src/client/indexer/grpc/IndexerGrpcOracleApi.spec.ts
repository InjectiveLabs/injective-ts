import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { IndexerGrpcOracleApi } from './IndexerGrpcOracleApi.js'

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
