import MsgInstantSpotMarketLaunch from './MsgInstantSpotMarketLaunch.js'
import snakecaseKeys from 'snakecase-keys'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import {
  getEip712TypedData,
  getEip712TypedDataV2,
} from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'
import { EIP712Version } from '@injectivelabs/ts-types'

const market = mockFactory.injUsdtSpotMarket

const params: MsgInstantSpotMarketLaunch['params'] = {
  proposer: mockFactory.injectiveAddress,
  market: {
    sender: mockFactory.injectiveAddress,
    ticker: market.ticker,
    baseDenom: market.baseDenom,
    quoteDenom: market.quoteDenom,
    minPriceTickSize: market.minPriceTickSize,
    minNotional: '1',
    minQuantityTickSize: market.minQuantityTickSize,
  },
}

const protoType = '/injective.exchange.v1beta1.MsgInstantSpotMarketLaunch'
const protoTypeAmino = 'exchange/MsgInstantSpotMarketLaunch'
const protoParams = {
  ...params.market,
}
const protoParamsAmino = snakecaseKeys(protoParams)
const message = MsgInstantSpotMarketLaunch.fromJSON(params)

describe('MsgInstantSpotMarketLaunch', () => {
  it('generates proper proto', () => {
    const proto = message.toProto()

    expect(proto).toStrictEqual({
      ...protoParams,
      minNotional: '1000000000000000000',
      minPriceTickSize: '1000',
      minQuantityTickSize: '1000000000000000000000000000000000',
    })
  })

  it('generates proper data', () => {
    const data = message.toData()

    expect(data).toStrictEqual({
      '@type': protoType,
      ...protoParams,
      minNotional: '1000000000000000000',
      minPriceTickSize: '1000',
      minQuantityTickSize: '1000000000000000000000000000000000',
    })
  })

  it('generates proper amino', () => {
    const amino = message.toAmino()

    expect(amino).toStrictEqual({
      type: protoTypeAmino,
      value: snakecaseKeys({
        ...protoParamsAmino,
        min_notional: '1',
        min_price_tick_size: '0.000000000000001',
        min_quantity_tick_size: '1000000000000000',
      }),
    })
  })

  it('generates proper web3Gw', () => {
    const web3 = message.toWeb3Gw()

    expect(web3).toStrictEqual({
      '@type': protoType,
      ...snakecaseKeys({
        ...protoParamsAmino,
        min_notional: '1',
        min_price_tick_size: '0.000000000000001',
        min_quantity_tick_size: '1000000000000000',
      }),
    })
  })

  describe('generates proper EIP712 compared to the Web3Gw (chain)', () => {
    const { endpoints, eip712Args, prepareEip712Request } = prepareEip712({
      messages: message,
    })

    it('EIP712 v1', async () => {
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
