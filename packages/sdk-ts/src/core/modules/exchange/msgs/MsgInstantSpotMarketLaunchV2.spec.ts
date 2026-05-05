import { EIP712Version } from '@injectivelabs/ts-types'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import MsgInstantSpotMarketLaunchV2 from './MsgInstantSpotMarketLaunchV2.js'
import {
  getEip712TypedData,
  getEip712TypedDataV2,
} from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'

const market = mockFactory.injUsdtSpotMarket

const params: MsgInstantSpotMarketLaunchV2['params'] = {
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

const message = MsgInstantSpotMarketLaunchV2.fromJSON(params)

describe('MsgInstantSpotMarketLaunchV2', () => {
  describe('generates proper EIP712 compared to the Web3Gw (chain)', () => {
    const { endpoints, eip712Args, prepareEip712Request } = prepareEip712({
      messages: message,
    })

    // not supported on chain (invalid Go type math.LegacyDec for min_price_tick_size)
    it.skip('EIP712 v1', async () => {
      const eip712TypedData = getEip712TypedData(eip712Args)

      const txResponse = await new IndexerGrpcWeb3GwApi(
        endpoints.indexer,
      ).prepareEip712Request({
        ...prepareEip712Request,
        eip712Version: EIP712Version.V1,
      })

      expect(eip712TypedData).toStrictEqual(JSON.parse(txResponse.data))
    })

    it('EIP712 v2', async () => {
      const eip712TypedData = getEip712TypedDataV2(eip712Args)

      const txResponse = await new IndexerGrpcWeb3GwApi(
        endpoints.indexer,
      ).prepareEip712Request({
        ...prepareEip712Request,
        eip712Version: EIP712Version.V2,
      })

      expect(eip712TypedData).toStrictEqual(JSON.parse(txResponse.data))
    })
  })
})
