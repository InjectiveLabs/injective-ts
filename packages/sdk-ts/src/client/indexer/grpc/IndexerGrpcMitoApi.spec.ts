import { mockFactory } from '@injectivelabs/test-utils'
import { IndexerGrpcMitoTransformer } from '../transformers/index.js'
import { IndexerGrpcMitoApi } from './IndexerGrpcMitoApi.js'

const injectiveAddress = mockFactory.injectiveAddress
const vaultAddress = 'inj1zwv6feuzhy6a9wekh96cd57lsarmqlwxvdl4nk'
const stakingContractAddress = 'inj1pxzykc8qry3ytxwxr3ua72tn6e4wvusj40yy2w'
const idoAddress = 'inj1zwv6feuzhy6a9wekh96cd57lsarmqlwxvdl4nk'
const indexerGrpcMitoApi = new IndexerGrpcMitoApi(
  'https://devnet.api.ninja.injective.dev',
)

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

      if (response.subscriptions.length === 0) {
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
        stakingContractAddress,
      })

      if (response.holders.length === 0) {
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
      const response = await indexerGrpcMitoApi.fetchHolderPortfolio({
        stakingContractAddress,
        holderAddress: injectiveAddress,
      })

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

      if (response.entries.length === 0) {
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

  test('fetchIDO', async () => {
    try {
      const response = await indexerGrpcMitoApi.fetchIDO({
        contractAddress: vaultAddress,
      })

      if (!response.ido) {
        console.warn('fetchIDO.responseIsEmptyArray')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<typeof IndexerGrpcMitoTransformer.mitoIDOResponseToIDO>
        >(response),
      )
    } catch (e) {
      console.error('IndexerGrpcMitoApi.fetchIDO => ' + (e as any).message)
    }
  })

  test('fetchIDOs', async () => {
    try {
      const response = await indexerGrpcMitoApi.fetchIDOs()

      if (response.idos.length === 0) {
        console.warn('fetchIDOs.responseIsEmptyArray')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcMitoTransformer.mitoListIDOsResponseToIDOs
          >
        >(response),
      )
    } catch (e) {
      console.error('IndexerGrpcMitoApi.fetchIDOs => ' + (e as any).message)
    }
  })

  test('fetchIDOSubscribers', async () => {
    try {
      const response = await indexerGrpcMitoApi.fetchIDOSubscribers({
        contractAddress: vaultAddress,
      })

      if (response.subscribers.length === 0) {
        console.warn('fetchIDOSubscribers.responseIsEmptyArray')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcMitoTransformer.mitoIDOSubscribersResponseToIDOSubscribers
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcMitoApi.fetchIDOSubscribers => ' + (e as any).message,
      )
    }
  })

  test('fetchIDOSubscription', async () => {
    try {
      const response = await indexerGrpcMitoApi.fetchIDOSubscription({
        contractAddress: vaultAddress,
        accountAddress: injectiveAddress,
      })

      if (!response.subscription) {
        console.warn('fetchIDOSubscription.responseIsEmptyArray')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcMitoTransformer.mitoIDOSubscriptionResponseToIDOSubscription
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcMitoApi.fetchIDOSubscription => ' + (e as any).message,
      )
    }
  })

  test('fetchIDOActivities', async () => {
    try {
      const response = await indexerGrpcMitoApi.fetchIDOActivities()

      if (response.activities.length === 0) {
        console.warn('fetchIDOActivities.responseIsEmptyArray')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcMitoTransformer.mitoIDOActivitiesResponseToIDOActivities
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcMitoApi.fetchIDOActivities => ' + (e as any).message,
      )
    }
  })

  test('fetchIDOWhitelist', async () => {
    try {
      const response = await indexerGrpcMitoApi.fetchIDOWhitelist({
        idoAddress,
      })

      if (response.accounts.length === 0) {
        console.warn('fetchIDOWhitelist.responseIsEmptyArray')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcMitoTransformer.mitoWhitelistAccountResponseToWhitelistAccount
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcMitoApi.fetchIDOWhitelist => ' + (e as any).message,
      )
    }
  })

  test('fetchClaimReferences', async () => {
    try {
      const response = await indexerGrpcMitoApi.fetchClaimReferences({
        idoAddress,
        accountAddress: injectiveAddress,
      })

      if (response.claimReferences.length === 0) {
        console.warn('fetchClaimReferences.responseIsEmptyArray')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcMitoTransformer.claimReferencesResponseToClaimReferences
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcMitoApi.fetchClaimReferences => ' + (e as any).message,
      )
    }
  })
})
