import MsgBatchCancelDerivativeOrders from './MsgBatchCancelDerivativeOrders'
import { mockFactory } from '@injectivelabs/test-utils'
import snakecaseKeys from 'snakecase-keys'

const params: MsgBatchCancelDerivativeOrders['params'] = {
  injectiveAddress: mockFactory.injectiveAddress,
  orders: [
    {
      marketId: mockFactory.injUsdtDerivativeMarket.marketId,
      orderHash: mockFactory.orderHash,
      subaccountId: mockFactory.subaccountId,
      cid: 'order-123',
    },
    {
      marketId: mockFactory.injUsdtDerivativeMarket.marketId,
      orderHash: mockFactory.orderHash2,
      subaccountId: mockFactory.subaccountId,
      cid: 'order-124',
    },
  ],
}

const protoType = '/injective.exchange.v1beta1.MsgBatchCancelDerivativeOrders'
const protoTypeShort = 'exchange/MsgBatchCancelDerivativeOrders'

const ordersWithOrderMask = params.orders.map((order) => ({
  ...order,
  orderMask: 1,
}))

const protoParams = {
  sender: params.injectiveAddress,
  data: ordersWithOrderMask,
}

const protoParamsAmino = {
  sender: params.injectiveAddress,
  data: snakecaseKeys(ordersWithOrderMask),
}

const message = MsgBatchCancelDerivativeOrders.fromJSON(params)

describe('MsgBatchCancelDerivativeOrders', () => {
  it('generates proper proto', () => {
    const proto = message.toProto()

    expect(proto).toStrictEqual(protoParams)
  })

  it('generates proper data', () => {
    const data = message.toData()

    expect(data).toStrictEqual({
      '@type': protoType,
      ...protoParams,
    })
  })

  it('generates proper amino', () => {
    const amino = message.toAmino()

    expect(amino).toStrictEqual({
      type: protoTypeShort,
      value: protoParamsAmino,
    })
  })

  it('generates proper Eip712 types', () => {
    const eip712Types = message.toEip712Types()

    expect(Object.fromEntries(eip712Types)).toStrictEqual({
      TypeData: [
        { name: 'market_id', type: 'string' },
        { name: 'subaccount_id', type: 'string' },
        { name: 'order_hash', type: 'string' },
        { name: 'order_mask', type: 'int32' },
        { name: 'cid', type: 'string' },
      ],
      MsgValue: [
        { name: 'sender', type: 'string' },
        { name: 'data', type: 'TypeData[]' },
      ],
    })
  })

  it('generates proper Eip712 values', () => {
    const eip712 = message.toEip712()

    expect(eip712).toStrictEqual({
      type: protoTypeShort,
      value: protoParamsAmino,
    })
  })

  it('generates proper web3', () => {
    const web3 = message.toWeb3()

    expect(web3).toStrictEqual({
      '@type': protoType,
      ...protoParamsAmino,
    })
  })
})
