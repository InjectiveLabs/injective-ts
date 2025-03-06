import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'
import MsgInstantSpotMarketLaunch from './MsgInstantSpotMarketLaunch.js'
import { getEip712TypedData, getEip712TypedDataV2 } from '../../../tx/index.js'

const market = mockFactory.injUsdtSpotMarket

const params: MsgInstantSpotMarketLaunch['params'] = {
  proposer: mockFactory.injectiveAddress,
  market: {
    minNotional: '1',
    sender: mockFactory.injectiveAddress,
    ticker: market.ticker,
    baseDenom: market.baseDenom,
    quoteDenom: market.quoteDenom,
    baseDecimals: market.baseToken.decimals,
    quoteDecimals: market.quoteToken.decimals,
    minPriceTickSize: market.minPriceTickSize,
    minQuantityTickSize: market.minQuantityTickSize,
  },
}

const message = MsgInstantSpotMarketLaunch.fromJSON(params)

describe('MsgInstantSpotMarketLaunch', () => {
  describe('generates proper EIP712 compared to the Web3Gw (chain)', () => {
    const { endpoints, eip712Args, prepareEip712Request } = prepareEip712({
      sequence: 0,
      accountNumber: 3,
      messages: message,
    })

    // TODO
    it('EIP712 v1', async () => {
      const eip712TypedData = getEip712TypedData(eip712Args)

      const txResponse = await new IndexerGrpcWeb3GwApi(
        endpoints.indexer,
      ).prepareEip712Request({
        ...prepareEip712Request,
        eip712Version: 'v1',
      })
      expect(eip712TypedData).toStrictEqual(JSON.parse(txResponse.data))
    })

    it('EIP712 v2', async () => {
      const eip712TypedData = getEip712TypedDataV2(eip712Args)

      const txResponse = await new IndexerGrpcWeb3GwApi(
        endpoints.indexer,
      ).prepareEip712Request({ ...prepareEip712Request, eip712Version: 'v2' })

      expect(eip712TypedData).toStrictEqual(JSON.parse(txResponse.data))
    })
  })
})
