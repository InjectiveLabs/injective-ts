import MsgCreateDerivativeLimitOrder from './MsgCreateDerivativeLimitOrder.js'
import { mockFactory } from '@injectivelabs/test-utils'
import snakecaseKeys from 'snakecase-keys'

const params: MsgCreateDerivativeLimitOrder['params'] = {
  feeRecipient: mockFactory.injectiveAddress2,
  injectiveAddress: mockFactory.injectiveAddress,
  margin: '75000000',
  marketId: mockFactory.injUsdtDerivativeMarket.marketId,
  orderType: 1,
  price: '1500000',
  quantity: '100',
  subaccountId: mockFactory.subaccountId,
  cid: '',
  triggerPrice: '0',
}

const protoType = '/injective.exchange.v1beta1.MsgCreateDerivativeLimitOrder'
const protoTypeShort = 'exchange/MsgCreateDerivativeLimitOrder'
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
    margin: params.margin,
    triggerPrice: params.triggerPrice,
  },
}
const formattedProtoParams = {
  ...protoParams,
  order: {
    ...protoParams.order,
    margin: '75000000000000000000000000',
    orderInfo: {
      ...protoParams.order.orderInfo,
      price: '1500000000000000000000000',
      quantity: '100000000000000000000',
    },
  },
}
const protoParamsAmino = snakecaseKeys(protoParams)
const message = MsgCreateDerivativeLimitOrder.fromJSON(params)

describe('MsgCreateDerivativeLimitOrder', () => {
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

  it('generates proper Eip712 types', () => {
    const eip712Types = message.toEip712Types()

    expect(Object.fromEntries(eip712Types)).toStrictEqual({
      TypeOrder: [
        { name: 'market_id', type: 'string' },
        { name: 'order_info', type: 'TypeOrderOrderInfo' },
        { name: 'order_type', type: 'int32' },
        { name: 'margin', type: 'string' },
        { name: 'trigger_price', type: 'string' },
      ],
      TypeOrderOrderInfo: [
        { name: 'subaccount_id', type: 'string' },
        { name: 'fee_recipient', type: 'string' },
        { name: 'price', type: 'string' },
        { name: 'quantity', type: 'string' },
      ],
      MsgValue: [
        { name: 'sender', type: 'string' },
        { name: 'order', type: 'TypeOrder' },
      ],
    })
  })

  it('generates proper Eip712 values', () => {
    const eip712 = message.toEip712()

    const value = snakecaseKeys(protoParams)
    const formattedValue = {
      ...value,
      order: {
        ...value.order,
        margin: '75000000.000000000000000000',
        order_info: {
          fee_recipient: params.feeRecipient,
          price: '1500000.000000000000000000',
          quantity: '100.000000000000000000',
          subaccount_id: params.subaccountId,
        },
        trigger_price: '0.000000000000000000',
      },
    }

    expect(eip712).toStrictEqual({
      type: protoTypeShort,
      value: formattedValue,
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
