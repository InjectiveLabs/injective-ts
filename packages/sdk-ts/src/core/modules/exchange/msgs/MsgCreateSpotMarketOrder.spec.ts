import MsgCreateSpotMarketOrder from './MsgCreateSpotMarketOrder.js'
import snakecaseKeys from 'snakecase-keys'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import {
  getEip712TypedData,
  getEip712TypedDataV2,
} from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'
import { EIP712Version } from '@injectivelabs/ts-types'

const params: MsgCreateSpotMarketOrder['params'] = {
  feeRecipient: mockFactory.injectiveAddress2,
  injectiveAddress: mockFactory.injectiveAddress,
  marketId: mockFactory.injUsdtSpotMarket.marketId,
  orderType: 1,
  price: '1765000',
  quantity: '100',
  subaccountId: mockFactory.subaccountId,
  cid: 'test-cid',
  triggerPrice: '0',
}

const protoType = '/injective.exchange.v1beta1.MsgCreateSpotMarketOrder'
const protoTypeShort = 'exchange/MsgCreateSpotMarketOrder'
const protoParams = {
  sender: params.injectiveAddress,
  order: {
    marketId: params.marketId,
    orderInfo: {
      feeRecipient: params.feeRecipient,
      price: params.price,
      quantity: params.quantity,
      subaccountId: params.subaccountId,
      cid: params.cid,
    },
    orderType: params.orderType,
    triggerPrice: params.triggerPrice,
  },
}
const formattedProtoParams = {
  ...protoParams,
  order: {
    ...protoParams.order,
    orderInfo: {
      ...protoParams.order.orderInfo,
      price: '1765000000000000000000000',
      quantity: '100000000000000000000',
    },
  },
}
const protoParamsAmino = snakecaseKeys(protoParams)
const message = MsgCreateSpotMarketOrder.fromJSON(params)

describe('MsgCreateSpotMarketOrder', () => {
  it('generates proper proto', () => {
    const proto = message.toProto()

    expect(proto).toStrictEqual(formattedProtoParams)
  })

  it('generates proper data', () => {
    const data = message.toData()

    expect(data).toStrictEqual({
      '@type': protoType,
      ...formattedProtoParams,
    })
  })

  it('generates proper amino', () => {
    const amino = message.toAmino()

    expect(amino).toStrictEqual({
      type: protoTypeShort,
      value: protoParamsAmino,
    })
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
