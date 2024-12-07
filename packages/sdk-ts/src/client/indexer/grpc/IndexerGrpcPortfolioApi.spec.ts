import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
// import { INJ_DENOM } from '@injectivelabs/utils'
import { mockFactory } from '@injectivelabs/utils/test-utils'
import { IndexerGrpcAccountPortfolioTransformer } from '../transformers/index.js'
import { IndexerGrpcAccountPortfolioApi } from './IndexerGrpcPortfolioApi.js'

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

// test('fetchAccountPortfolioTokenHolders', async () => {
//   try {
//     const response =
//       await indexerGrpcPortfolioApi.fetchAccountPortfolioTokenHolders({
//         denom: INJ_DENOM,
//       })

//     expect(response).toBeDefined()
//     expect(response).toEqual(
//       expect.objectContaining<
//         ReturnType<
//           typeof IndexerGrpcAccountPortfolioTransformer.tokenHoldersResponseToTokenHolders
//         >
//       >(response),
//     )
//   } catch (e) {
//     console.error(
//       'IndexerGrpcAccountPortfolioApi.fetchAccountPortfolioTokenHolders => ' +
//         (e as any).message,
//     )
//   }
// })
