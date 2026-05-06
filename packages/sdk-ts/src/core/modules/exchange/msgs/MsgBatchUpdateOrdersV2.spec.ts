import { EIP712Version } from '@injectivelabs/ts-types'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import MsgBatchUpdateOrdersV2 from './MsgBatchUpdateOrdersV2.js'
import {
  getEip712TypedData,
  getEip712TypedDataV2,
} from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'

const params: MsgBatchUpdateOrdersV2['params'] = {
  injectiveAddress: mockFactory.injectiveAddress,
  subaccountId: mockFactory.subaccountId,
  spotOrdersToCreate: [
    {
      orderType: 1,
      marketId: mockFactory.injUsdtSpotMarket.marketId,
      feeRecipient: mockFactory.injectiveAddress2,
      price: '1500000',
      quantity: '100',
      cid: 'test-cid',
    },
  ],
}

const protoType = '/injective.exchange.v2.MsgBatchUpdateOrders'
const protoTypeShort = 'exchange/MsgBatchUpdateOrders'
const message = MsgBatchUpdateOrdersV2.fromJSON(params)

describe('MsgBatchUpdateOrdersV2', () => {
  it('generates proper proto', () => {
    const proto = message.toProto()

    expect(proto.sender).toStrictEqual(params.injectiveAddress)
    expect(proto.spotOrdersToCreate).toHaveLength(1)
    expect(proto.spotOrdersToCreate[0].marketId).toStrictEqual(
      params.spotOrdersToCreate![0].marketId,
    )
  })

  it('generates proper data', () => {
    const data = message.toData()

    expect(data['@type']).toStrictEqual(protoType)
    expect(data.sender).toStrictEqual(params.injectiveAddress)
  })

  it('generates proper amino', () => {
    const amino = message.toAmino()

    expect(amino.type).toStrictEqual(protoTypeShort)
    expect(amino.value.sender).toStrictEqual(params.injectiveAddress)
    expect(amino.value.spot_orders_to_create).toHaveLength(1)
    expect(amino.value.spot_orders_to_create[0].market_id).toStrictEqual(
      params.spotOrdersToCreate![0].marketId,
    )
  })

  it('generates proper web3Gw', () => {
    const web3 = message.toWeb3Gw()

    expect(web3['@type']).toStrictEqual(protoType)
    expect(web3.sender).toStrictEqual(params.injectiveAddress)
    expect(web3.spot_orders_to_create).toHaveLength(1)
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
