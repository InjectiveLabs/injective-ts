import { mockFactory } from '@injectivelabs/utils/test-utils'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { IndexerCampaignTransformer } from '../transformers/index.js'
import { IndexerGrpcCampaignApi } from './IndexerGrpcCampaignApi.js'

const injectiveAddress = mockFactory.injectiveAddress
const CAMPAIGN_ID = 'spot-grid-inj-usdt-test'
const MARKET_ID =
  '0xa508cb32923323679f29a032c70342c147c17d0145625922b0ef22e955c844c0'
const CAMPAIGN_CONTRACT = 'inj1yum4v0v5l92jkxn8xpn9mjg7wuldk784ysdn0w'
const endpoints = getNetworkEndpoints(Network.MainnetSentry)
const indexerGrpcCampaignApi = new IndexerGrpcCampaignApi(endpoints.indexer)

describe.skip('IndexerGrpcCampaignApi', () => {
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

  test('fetchGuilds', async () => {
    try {
      const response = await indexerGrpcCampaignApi.fetchGuilds({
        sortBy: 'rank',
        campaignContract: CAMPAIGN_CONTRACT,
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<typeof IndexerCampaignTransformer.GuildsResponseToGuilds>
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcCampaignApi.fetchGuilds => ' + (e as any).message,
      )
    }
  })

  test('fetchGuildMember', async () => {
    try {
      const response = await indexerGrpcCampaignApi.fetchGuildMember({
        address: injectiveAddress,
        campaignContract: CAMPAIGN_CONTRACT,
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerCampaignTransformer.GuildMemberResponseToGuildMember
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcCampaignApi.fetchGuildMember => ' + (e as any).message,
      )
    }
  })

  test('fetchGuildMembers', async () => {
    try {
      const response = await indexerGrpcCampaignApi.fetchGuildMembers({
        guildId: '1',
        includeGuildInfo: false,
        campaignContract: CAMPAIGN_CONTRACT,
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerCampaignTransformer.GuildMembersResponseToGuildMembers
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcCampaignApi.fetchGuildMembers => ' + (e as any).message,
      )
    }
  })

  test('fetchCampaigns', async () => {
    try {
      const response = await indexerGrpcCampaignApi.fetchCampaigns({
        type: 'reward',
        active: true,
        limit: 10,
        cursor: '',
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerCampaignTransformer.CampaignsV2ResponseToCampaigns
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcCampaignApi.fetchCampaigns => ' + (e as any).message,
      )
    }
  })
})
