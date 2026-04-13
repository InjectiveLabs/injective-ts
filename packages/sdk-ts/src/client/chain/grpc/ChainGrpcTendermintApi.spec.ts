import { Network, getNetworkEndpoints } from '@injectivelabs/networks'
import { ChainGrpcTendermintApi } from './ChainGrpcTendermintApi.js'

const endpoints = getNetworkEndpoints(Network.MainnetSentry)
const chainGrpcTendermintApi = new ChainGrpcTendermintApi(endpoints.grpc)

describe('ChainGrpcTendermintApi', () => {
  test('fetchLatestBlock', async () => {
    try {
      const response = await chainGrpcTendermintApi.fetchLatestBlock()

      expect(response).toBeDefined()
      expect(response).toEqual(expect.objectContaining(response))
    } catch (e) {
      console.error(
        'ChainGrpcTendermintApi.fetchLatestBlock => ' + (e as any).message,
      )
    }
  })

  test('fetchBlock', async () => {
    try {
      const response = await chainGrpcTendermintApi.fetchBlock(1)

      expect(response).toBeDefined()
      expect(response).toEqual(expect.objectContaining(response))
    } catch (e) {
      console.error(
        'ChainGrpcTendermintApi.fetchBlock => ' + (e as any).message,
      )
    }
  })
})
