import { EIP712Version } from '@injectivelabs/ts-types'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import MsgLiquidatePositionV2 from './MsgLiquidatePositionV2.js'
import {
  getEip712TypedData,
  getEip712TypedDataV2,
} from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'

const market = mockFactory.injUsdtDerivativeMarket

const params: MsgLiquidatePositionV2['params'] = {
  injectiveAddress: mockFactory.injectiveAddress,
  subaccountId: mockFactory.subaccountId,
  marketId: market.marketId,

  order: {
    subaccountId: mockFactory.subaccountId,
    feeRecipient: mockFactory.injectiveAddress,
    price: '1765000',
    quantity: '100',
    marketId: market.marketId,
    orderType: 1 /** buy */,
    margin: '88250000',
    cid: 'test-cid',
  },
}

const protoType = '/injective.exchange.v2.MsgLiquidatePosition'
const protoTypeShort = 'exchange/MsgLiquidatePosition'

const protoOrder = {
  marketId: market.marketId,
  orderInfo: {
    subaccountId: params.order!.subaccountId,
    feeRecipient: params.order!.feeRecipient,
    price: '1765000000000000000000000',
    quantity: '100000000000000000000',
    cid: params.order!.cid,
  },
  orderType: params.order!.orderType,
  margin: '88250000000000000000000000',
  triggerPrice: '0',
  expirationBlock: BigInt(0),
}
const formattedProtoParams = {
  sender: params.injectiveAddress,
  subaccountId: params.subaccountId,
  marketId: market.marketId,
  order: protoOrder,
}
const protoParamsAmino = {
  sender: params.injectiveAddress,
  subaccount_id: params.subaccountId,
  market_id: market.marketId,
  order: {
    market_id: market.marketId,
    order_info: {
      subaccount_id: params.order!.subaccountId,
      fee_recipient: params.order!.feeRecipient,
      price: params.order!.price,
      quantity: params.order!.quantity,
      cid: params.order!.cid,
    },
    order_type: params.order!.orderType,
    margin: params.order!.margin,
    trigger_price: '0',
    expiration_block: '0',
  },
}

const message = MsgLiquidatePositionV2.fromJSON(params)

describe('MsgLiquidatePositionV2', () => {
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
