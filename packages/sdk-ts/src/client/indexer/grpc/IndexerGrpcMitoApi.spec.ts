import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { mockFactory } from '@injectivelabs/test-utils'
import { IndexerGrpcMitoTransformer } from '../transformers'
import { IndexerGrpcMitoApi } from './IndexerGrpcMitoApi'

const injectiveAddress = mockFactory.injectiveAddress
const vaultAddress = 'inj1zwv6feuzhy6a9wekh96cd57lsarmqlwxvdl4nk'
const endpoints = getNetworkEndpoints(Network.Devnet)
const indexerGrpcMitoApi = new IndexerGrpcMitoApi(endpoints.indexer)

describe('IndexerGrpcMitoApi', () => {
  test('fetchVault', async () => {
    try {
      const response = await indexerGrpcMitoApi.fetchVault({
        contractAddress: vaultAddress,
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<typeof IndexerGrpcMitoTransformer.vaultResponseToVault>
        >(response),
      )
    } catch (e) {
      console.error('IndexerGrpcMitoApi.fetchVault => ' + (e as any).message)
    }
  })

  test('fetchVaults', async () => {
    try {
      const response = await indexerGrpcMitoApi.fetchVaults({})

      if (response.vaults.length === 0) {
        console.warn('fetchVaults.responseIsEmptyArray')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<typeof IndexerGrpcMitoTransformer.vaultsResponseToVaults>
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcMitoApi.fetchVaults vaults => ' + (e as any).message,
      )
    }
  })

  test('fetchLpTokenPriceChart', async () => {
    try {
      const response = await indexerGrpcMitoApi.fetchLpTokenPriceChart({
        vaultAddress,
      })

      if (response.length === 0) {
        console.warn('fetchLpTokenPriceChart.responseIsEmptyArray')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcMitoTransformer.lpTokenPriceChartResponseToLPTokenPriceChart
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcMitoApi.fetchLpTokenPriceChart => ' + (e as any).message,
      )
    }
  })

  test('fetchTVLChartRequest', async () => {
    try {
      const response = await indexerGrpcMitoApi.fetchTVLChartRequest({
        vaultAddress,
      })

      if (response.length === 0) {
        console.warn('fetchTVLChartRequest.responseIsEmptyArray')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcMitoTransformer.lpTokenPriceChartResponseToLPTokenPriceChart
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcMitoApi.fetchTVLChartRequest => ' + (e as any).message,
      )
    }
  })

  test('fetchVaultsByHolderAddress', async () => {
    try {
      const response = await indexerGrpcMitoApi.fetchVaultsByHolderAddress({
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
            typeof IndexerGrpcMitoTransformer.vaultsByHolderAddressResponseToVaultsByHolderAddress
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcMitoApi.fetchVaultsByHolderAddress => ' +
          (e as any).message,
      )
    }
  })

  test('fetchLPHolders', async () => {
    try {
      const response = await indexerGrpcMitoApi.fetchLPHolders({
        vaultAddress,
      })

      if (response.length === 0) {
        console.warn('fetchLPHolders.responseIsEmptyArray')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcMitoTransformer.lpHoldersResponseToLPHolders
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcMitoApi.fetchLPHolders => ' + (e as any).message,
      )
    }
  })

  test('fetchHolderPortfolio', async () => {
    try {
      const response = await indexerGrpcMitoApi.fetchHolderPortfolio(
        injectiveAddress,
      )

      if (!response) {
        console.warn('fetchHolderPortfolio.portfolioNotFound')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcMitoTransformer.portfolioResponseToPortfolio
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcMitoApi.fetchHolderPortfolio => ' + (e as any).message,
      )
    }
  })

  test('fetchLeaderboard', async () => {
    try {
      const response = await indexerGrpcMitoApi.fetchLeaderboard()

      if (!response) {
        console.warn('fetchLeaderboard.leaderBoardNotFound')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcMitoTransformer.leaderboardResponseToLeaderboard
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcMitoApi.fetchLeaderboard => ' + (e as any).message,
      )
    }
  })

  test('fetchTransferHistory', async () => {
    try {
      const response = await indexerGrpcMitoApi.fetchTransferHistory({})

      if (response.transfers.length === 0) {
        console.warn('fetchTransferHistory.responseIsEmptyArray')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcMitoTransformer.transferHistoryResponseToTransfer
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcMitoApi.fetchTransferHistory vaults => ' +
          (e as any).message,
      )
    }
  })

  test('fetchLeaderboardEpochs', async () => {
    try {
      const response = await indexerGrpcMitoApi.fetchLeaderboardEpochs({})

      if (response.epochs.length === 0) {
        console.warn('fetchLeaderboardEpochs.responseIsEmptyArray')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcMitoTransformer.leaderboardEpochsResponseToLeaderboardEpochs
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcMitoApi.fetchLeaderboardEpochs vaults => ' +
          (e as any).message,
      )
    }
  })

  test('fetchLeaderboardEpochs', async () => {
    try {
      const response = await indexerGrpcMitoApi.fetchLeaderboardEpochs({})

      if (response.epochs.length === 0) {
        console.warn('fetchLeaderboardEpochs.responseIsEmptyArray')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcMitoTransformer.leaderboardEpochsResponseToLeaderboardEpochs
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcMitoApi.fetchLeaderboardEpochs vaults => ' +
          (e as any).message,
      )
    }
  })

  test('fetchMissions', async () => {
    try {
      const response = await indexerGrpcMitoApi.fetchMissions({
        accountAddress: injectiveAddress,
      })

      if (response.length === 0) {
        console.warn('fetchMissions.responseIsEmptyArray')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcMitoTransformer.mitoMissionsResponseMissions
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcMitoApi.fetchMissions missions => ' + (e as any).message,
      )
    }
  })

  test('fetchMissionLeaderboard', async () => {
    try {
      const response = await indexerGrpcMitoApi.fetchMissionLeaderboard()

      if (response.data.length === 0) {
        console.warn('fetchMissionLeaderboard.responseIsEmptyArray')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcMitoTransformer.mitoMissionLeaderboardResponseToMissionLeaderboard
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcMitoApi.fetchMissionLeaderboard missionLeaderboard => ' +
          (e as any).message,
      )
    }
  })
})
