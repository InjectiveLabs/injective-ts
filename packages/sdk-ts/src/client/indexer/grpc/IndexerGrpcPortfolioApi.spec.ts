import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { mockFactory } from '@injectivelabs/test-utils'
import { IndexerGrpcAccountPortfolioTransformer } from '../transformers'
import { IndexerGrpcAccountPortfolioApi } from './IndexerGrpcPortfolioApi'

const injectiveAddress = mockFactory.injectiveAddress
const endpoints = getNetworkEndpoints(Network.MainnetSentry)
const indexerGrpcPortfolioApi = new IndexerGrpcAccountPortfolioApi(
  endpoints.indexer,
)

describe('IndexerGrpcAccountPortfolioApi', () => {
  test('fetchAccountPortfolio', async () => {
    try {
      const response = await indexerGrpcPortfolioApi.fetchAccountPortfolio(
        injectiveAddress,
      )

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcAccountPortfolioTransformer.accountPortfolioResponseToAccountPortfolio
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcAccountPortfolioApi.fetchAccountPortfolio => ' +
          (e as any).message,
      )
    }
  })
})
