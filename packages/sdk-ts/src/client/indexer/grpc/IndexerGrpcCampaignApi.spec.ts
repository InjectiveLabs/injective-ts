import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { IndexerCampaignTransformer } from '../transformers'
import { IndexerGrpcCampaignApi } from './IndexerGrpcCampaignApi'

const CAMPAIGN_ID = 'spot-grid-inj-usdt-test'
const MARKET_ID =
  '0xa508cb32923323679f29a032c70342c147c17d0145625922b0ef22e955c844c0'
const endpoints = getNetworkEndpoints(Network.MainnetSentry)
const indexerGrpcCampaignApi = new IndexerGrpcCampaignApi(endpoints.indexer)

describe('IndexerGrpcCampaignApi', () => {
  test('fetchCampaign', async () => {
    try {
      const response = await indexerGrpcCampaignApi.fetchCampaign({
        marketId: MARKET_ID,
        campaignId: CAMPAIGN_ID,
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerCampaignTransformer.CampaignResponseToCampaign
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcCampaignApi.fetchCampaign => ' + (e as any).message,
      )
    }
  })
})
