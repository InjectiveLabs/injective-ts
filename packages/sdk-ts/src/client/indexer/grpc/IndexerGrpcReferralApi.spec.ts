import { mockFactory } from '@injectivelabs/utils/test-utils'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { IndexerGrpcReferralTransformer } from '../transformers/index.js'
import { IndexerGrpcReferralApi } from './IndexerGrpcReferralApi.js'

const injectiveAddress = mockFactory.injectiveAddress
const endpoints = getNetworkEndpoints(Network.MainnetSentry)
const indexerGrpcReferralApi = new IndexerGrpcReferralApi(endpoints.indexer)

describe('IndexerGrpcReferralApi', () => {
  test('fetchReferrerDetails', async () => {
    try {
      const response = await indexerGrpcReferralApi.fetchReferrerDetails(
        injectiveAddress,
      )

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcReferralTransformer.referrerDetailsResponseToReferrerDetails
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcReferralApi.fetchReferrerDetails => ' + (e as any).message,
      )
    }
  })

  test('fetchInviteeDetails', async () => {
    try {
      const response = await indexerGrpcReferralApi.fetchInviteeDetails(
        injectiveAddress,
      )

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcReferralTransformer.inviteeDetailsResponseToInviteeDetails
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcReferralApi.fetchInviteeDetails => ' + (e as any).message,
      )
    }
  })

  test('fetchReferrerByCode', async () => {
    try {
      const response = await indexerGrpcReferralApi.fetchReferrerByCode(
        injectiveAddress,
      )

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcReferralTransformer.referrerByCodeResponseToReferrerByCode
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcReferralApi.fetchReferrerByCode => ' + (e as any).message,
      )
    }
  })
})
