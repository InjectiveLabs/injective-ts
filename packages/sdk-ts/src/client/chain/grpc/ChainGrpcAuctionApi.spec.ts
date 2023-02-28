import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { ChainGrpcAuctionApi } from './ChainGrpcAuctionApi'

const endpoints = getNetworkEndpoints(Network.MainnetK8s)
const chainGrpcAuctionApi = new ChainGrpcAuctionApi(endpoints.grpc)

describe('ChainGrpcAuctionApi', () => {
  test('fetchModuleParams', async () => {
    const response = await chainGrpcAuctionApi.fetchModuleState()

    expect(response).toBeDefined()
    expect(response).toEqual(
      expect.objectContaining({
        params: {
          auctionPeriod: expect.any(Number),
          minNextBidIncrementRate: expect.any(String),
        },
        auctionRound: expect.any(Number),
        highestBid: expect.any(Object),
        auctionEndingTimestamp: expect.any(Number),
      }),
    )
  })
})
