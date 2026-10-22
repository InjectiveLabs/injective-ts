import snakecaseKeys from 'snakecase-keys'
import { Network } from '@injectivelabs/networks'
import { EIP712Version } from '@injectivelabs/ts-types'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import MsgUpdateSpotMarketV2 from './MsgUpdateSpotMarketV2.js'
import {
  getEip712TypedData,
  getEip712TypedDataV2,
} from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'

const params: MsgUpdateSpotMarketV2['params'] = {
  admin: mockFactory.injectiveAddress,
  marketId: mockFactory.injUsdtDerivativeMarket.marketId,
  newMinPriceTickSize: '0.0000001',
  newMinNotional: '0',
  newMinQuantityTickSize: '10',
}

const protoType = '/injective.exchange.v2.MsgUpdateSpotMarket'
const protoParams = {
  admin: params.admin,
  marketId: params.marketId,
  newMinPriceTickSize: '0.0000001',
  newMinQuantityTickSize: '10',
  newMinNotional: '0',
  newTicker: '',
}
const protoParamsAmino = snakecaseKeys(protoParams)
// the proto stores LegacyDec, i.e. the human-readable params scaled by 1e18
const chainProtoParams = {
  ...protoParams,
  newMinPriceTickSize: '100000000000',
  newMinQuantityTickSize: '10000000000000000000',
  newMinNotional: '0',
}
const message = MsgUpdateSpotMarketV2.fromJSON(params)

describe('MsgUpdateSpotMarketV2', () => {
  it('generates proper proto', () => {
    const proto = message.toProto()

    expect(proto).toStrictEqual(chainProtoParams)
  })

  it('generates proper data', () => {
    const data = message.toData()

    expect(data).toStrictEqual({
      '@type': protoType,
      ...chainProtoParams,
    })
  })

  it('generates proper amino', () => {
    expect(message.toAmino()).toMatchInlineSnapshot(`
      {
        "type": "exchange/v2/MsgUpdateSpotMarket",
        "value": {
          "admin": "inj14au322k9munkmx5wrchz9q30juf5wjgz2cfqku",
          "market_id": "0x7cc8b10d7deb61e744ef83bdec2bbcf4a056867e89b062c6a453020ca82bd4e4",
          "new_min_notional": "0",
          "new_min_price_tick_size": "100000000000",
          "new_min_quantity_tick_size": "10000000000000000000",
        },
      }
    `)
  })

  it('generates proper web3Gw', () => {
    const web3 = message.toWeb3Gw()

    expect(web3).toStrictEqual({
      '@type': protoType,
      ...protoParamsAmino,
    })
  })

  describe('generates proper EIP712 compared to the Web3Gw (chain)', () => {
    const { endpoints, eip712Args, prepareEip712Request } = prepareEip712({
      // TODO: switch to Network.Mainnet after the v1.21 mainnet upgrade
      network: Network.Testnet,
      messages: message,
    })

    // the chain's EIP712 v1 typed-data generator rejects math.LegacyDec fields
    it('EIP712 v1 throws, use EIP712 v2', () => {
      expect(() => getEip712TypedData(eip712Args)).toThrow(
        'Please use EIP712_v2',
      )
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
