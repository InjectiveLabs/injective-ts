import { MsgCreateDerivativeMarketOrder as BaseMsgCreateDerivativeMarketOrder } from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import MsgCreateDerivativeMarketOrder from './MsgCreateDerivativeMarketOrder'
import { mockFactory } from '../../../../../../../tests/mocks'
import snakecaseKeys from 'snakecase-keys'

const params: MsgCreateDerivativeMarketOrder['params'] = {
  feeRecipient: mockFactory.injectiveAddress2,
  injectiveAddress: mockFactory.injectiveAddress,
  margin: '88250000',
  marketId: mockFactory.injUsdtDerivativeMarket.marketId,
  orderType: 1,
  price: '1765000',
  quantity: '100',
  subaccountId: mockFactory.subaccountId,
  triggerPrice: '0',
}

const protoType = '/injective.exchange.v1beta1.MsgCreateDerivativeMarketOrder'
const protoTypeShort = 'exchange/MsgCreateDerivativeMarketOrder'
const protoParams = {
  sender: params.injectiveAddress,
  order: {
    marketId: params.marketId,
    orderInfo: {
      feeRecipient: params.feeRecipient,
      price: params.price,
      quantity: params.quantity,
      subaccountId: params.subaccountId,
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
    margin: '88250000000000000000000000',
    orderInfo: {
      ...protoParams.order.orderInfo,
      price: '1765000000000000000000000',
      quantity: '100000000000000000000',
    },
  },
}

const message = MsgCreateDerivativeMarketOrder.fromJSON(params)

describe.only('MsgCreateDerivativeMarketOrder', () => {
  it('generates proper proto', () => {
    const proto = message.toProto()

    expect(proto instanceof BaseMsgCreateDerivativeMarketOrder).toBe(true)
    expect(proto.toObject()).toStrictEqual(formattedProtoParams)
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
      ...protoParams,
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
        margin: '88250000.000000000000000000',
        order_info: {
          fee_recipient: params.feeRecipient,
          price: '1765000.000000000000000000',
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
      ...protoParams,
    })
  })
})
