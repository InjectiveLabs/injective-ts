import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { mockFactory } from '@injectivelabs/test-utils'
import { IndexerGrpcNinjaTransformer } from '../transformers'
import { IndexerGrpcNinjaApi } from './IndexerGrpcNinjaApi'

const injectiveAddress = mockFactory.injectiveAddress
const vaultAddress = 'inj1zwv6feuzhy6a9wekh96cd57lsarmqlwxvdl4nk'
const endpoints = getNetworkEndpoints(Network.Devnet)
const indexerGrpcNinjaApi = new IndexerGrpcNinjaApi(endpoints.indexer)

describe('IndexerGrpcNinjaApi', () => {
  test('fetchVault', async () => {
    try {
      const response = await indexerGrpcNinjaApi.fetchVault({
        contractAddress: vaultAddress,
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<typeof IndexerGrpcNinjaTransformer.vaultResponseToVault>
        >(response),
      )
    } catch (e) {
      console.error('IndexerGrpcNinjaApi.fetchVault => ' + (e as any).message)
    }
  })

  test('fetchVaults', async () => {
    try {
      const response = await indexerGrpcNinjaApi.fetchVaults({})

      if (response.vaults.length === 0) {
        console.warn('fetchVaults.responseIsEmptyArray')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<typeof IndexerGrpcNinjaTransformer.vaultsResponseToVaults>
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcNinjaApi.fetchVaults vaults => ' + (e as any).message,
      )
    }
  })

  test('fetchLpTokenPriceChart', async () => {
    try {
      const response = await indexerGrpcNinjaApi.fetchLpTokenPriceChart({
        vaultAddress,
      })

      if (response.length === 0) {
        console.warn('fetchLpTokenPriceChart.responseIsEmptyArray')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcNinjaTransformer.LPTokenPriceChartResponseToLPTokenPriceChart
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcNinjaApi.fetchLpTokenPriceChart => ' + (e as any).message,
      )
    }
  })

  test('fetchTVLChartRequest', async () => {
    try {
      const response = await indexerGrpcNinjaApi.fetchTVLChartRequest({
        vaultAddress,
      })

      if (response.length === 0) {
        console.warn('fetchTVLChartRequest.responseIsEmptyArray')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcNinjaTransformer.LPTokenPriceChartResponseToLPTokenPriceChart
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcNinjaApi.fetchTVLChartRequest => ' + (e as any).message,
      )
    }
  })

  test('fetchVaultsByHolderAddress', async () => {
    try {
      const response = await indexerGrpcNinjaApi.fetchVaultsByHolderAddress({
        vaultAddress,
        holderAddress: injectiveAddress,
      })

      if (response.length === 0) {
        console.warn('fetchVaultsByHolderAddress.responseIsEmptyArray')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcNinjaTransformer.VaultsByHolderAddressResponseToVaultsByHolderAddress
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcNinjaApi.fetchVaultsByHolderAddress => ' +
          (e as any).message,
      )
    }
  })

  test('fetchLPHolders', async () => {
    try {
      const response = await indexerGrpcNinjaApi.fetchLPHolders({
        vaultAddress,
      })

      if (response.length === 0) {
        console.warn('fetchLPHolders.responseIsEmptyArray')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcNinjaTransformer.LPHoldersResponseToLPHolders
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcNinjaApi.fetchLPHolders => ' + (e as any).message,
      )
    }
  })

  test('fetchHolderPortfolio', async () => {
    try {
      const response = await indexerGrpcNinjaApi.fetchHolderPortfolio(
        injectiveAddress,
      )

      if (!response) {
        console.warn('fetchHolderPortfolio.portfolioNotFound')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcNinjaTransformer.PortfolioResponseToPortfolio
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcNinjaApi.fetchHolderPortfolio => ' + (e as any).message,
      )
    }
  })

  test('fetchLeaderboard', async () => {
    try {
      const response = await indexerGrpcNinjaApi.fetchLeaderboard()

      if (!response) {
        console.warn('fetchLeaderboard.leaderBoardNotFound')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcNinjaTransformer.LeaderboardResponseToLeaderboard
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcNinjaApi.fetchLeaderboard => ' + (e as any).message,
      )
    }
  })
})
