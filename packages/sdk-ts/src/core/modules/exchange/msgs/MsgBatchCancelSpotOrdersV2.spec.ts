import { Network } from '@injectivelabs/networks'
import { EIP712Version } from '@injectivelabs/ts-types'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import MsgBatchCancelSpotOrdersV2 from './MsgBatchCancelSpotOrdersV2.js'
import {
  getEip712TypedData,
  getEip712TypedDataV2,
} from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'

const params: MsgBatchCancelSpotOrdersV2['params'] = {
  injectiveAddress: mockFactory.injectiveAddress,
  orders: [
    {
      marketId: mockFactory.injUsdtSpotMarket.marketId,
      subaccountId: mockFactory.subaccountId,
      orderHash: mockFactory.orderHash,
      cid: 'order-1',
    },
  ],
}

const protoType = '/injective.exchange.v2.MsgBatchCancelSpotOrders'
const protoTypeShort = 'exchange/v2/MsgBatchCancelSpotOrders'
const message = MsgBatchCancelSpotOrdersV2.fromJSON(params)

describe('MsgBatchCancelSpotOrdersV2', () => {
  it('generates proper proto', () => {
    const proto = message.toProto()

    expect(proto.sender).toStrictEqual(params.injectiveAddress)
    expect(proto.data).toHaveLength(1)
    expect(proto.data[0].marketId).toStrictEqual(params.orders[0].marketId)
  })

  it('generates proper data', () => {
    const data = message.toData()

    expect(data['@type']).toStrictEqual(protoType)
    expect(data.sender).toStrictEqual(params.injectiveAddress)
    expect(data.data[0].marketId).toStrictEqual(params.orders[0].marketId)
  })

  it('generates proper amino', () => {
    const amino = message.toAmino()

    expect(amino.type).toStrictEqual(protoTypeShort)
    expect(amino.value.sender).toStrictEqual(params.injectiveAddress)
    expect(amino.value.data[0].market_id).toStrictEqual(
      params.orders[0].marketId,
    )
  })

  it('generates proper web3Gw', () => {
    const web3 = message.toWeb3Gw()

    expect(web3['@type']).toStrictEqual(protoType)
    expect(web3.sender).toStrictEqual(params.injectiveAddress)
    expect(web3.data[0].market_id).toStrictEqual(params.orders[0].marketId)
  })

  it('EIP712 v1 values and type equal the amino-json of the proto', () => {
    const eip712 = message.toEip712()
    const amino = message.toAmino()

    expect(eip712.type).toBe(amino.type)
    expect(eip712.value).toStrictEqual(amino.value)
  })

  describe('generates proper EIP712 compared to the Web3Gw (chain)', () => {
    const { endpoints, eip712Args, prepareEip712Request } = prepareEip712({
      // TODO: switch to Network.Mainnet after the v1.21 mainnet upgrade
      network: Network.Testnet,
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
      expect(message.toAmino()).toStrictEqual(
        JSON.parse(txResponse.data).message.msgs[0],
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
