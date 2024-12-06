import MsgCancelBinaryOptionsOrder from './MsgCancelBinaryOptionsOrder.js'
import { mockFactory } from '@injectivelabs/utils/test-utils'
import snakecaseKeys from 'snakecase-keys'

const params: MsgCancelBinaryOptionsOrder['params'] = {
  injectiveAddress: mockFactory.injectiveAddress,
  marketId: mockFactory.injUsdtDerivativeMarket.marketId,
  orderHash: mockFactory.orderHash,
  subaccountId: mockFactory.subaccountId,
  cid: 'order-123',
}

const protoType = '/injective.exchange.v1beta1.MsgCancelBinaryOptionsOrder'
const protoTypeShort = 'exchange/MsgCancelBinaryOptionsOrder'
const protoParams = {
  sender: params.injectiveAddress,
  marketId: params.marketId,
  orderHash: params.orderHash,
  subaccountId: params.subaccountId,
  orderMask: 1,
  cid: params.cid,
}
const protoParamsAmino = snakecaseKeys(protoParams)

const message = MsgCancelBinaryOptionsOrder.fromJSON(params)

describe('MsgCancelBinaryOptionsOrder', () => {
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
      MsgValue: [
        { name: 'sender', type: 'string' },
        { name: 'market_id', type: 'string' },
        { name: 'subaccount_id', type: 'string' },
        { name: 'order_hash', type: 'string' },
        { name: 'order_mask', type: 'int32' },
        { name: 'cid', type: 'string' },
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
