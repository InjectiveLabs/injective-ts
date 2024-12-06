import MsgIncreasePositionMargin from './MsgIncreasePositionMargin.js'
import { mockFactory } from '@injectivelabs/utils/test-utils'
import snakecaseKeys from 'snakecase-keys'

const params: MsgIncreasePositionMargin['params'] = {
  marketId: mockFactory.injUsdtDerivativeMarket.marketId,
  injectiveAddress: mockFactory.injectiveAddress,
  srcSubaccountId: mockFactory.subaccountId,
  dstSubaccountId: mockFactory.subaccountId2,
  amount: '1000',
}

const protoType = '/injective.exchange.v1beta1.MsgIncreasePositionMargin'
const protoTypeShort = 'exchange/MsgIncreasePositionMargin'
const protoParams = {
  marketId: params.marketId,
  sender: params.injectiveAddress,
  sourceSubaccountId: params.srcSubaccountId,
  destinationSubaccountId: params.dstSubaccountId,
  amount: params.amount,
}
const protoParamsAmino = snakecaseKeys(protoParams)
const message = MsgIncreasePositionMargin.fromJSON(params)

describe('MsgIncreasePositionMargin', () => {
  it('generates proper proto', () => {
    const proto = message.toProto()

    expect(proto).toStrictEqual({
      ...protoParams,
      amount: '1000000000000000000000',
    })
  })

  it('generates proper data', () => {
    const data = message.toData()

    expect(data).toStrictEqual({
      '@type': protoType,
      ...protoParams,
      amount: '1000000000000000000000',
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
        { name: 'source_subaccount_id', type: 'string' },
        { name: 'destination_subaccount_id', type: 'string' },
        { name: 'market_id', type: 'string' },
        { name: 'amount', type: 'string' },
      ],
    })
  })

  it('generates proper Eip712 values', () => {
    const eip712 = message.toEip712()

    expect(eip712).toStrictEqual({
      type: protoTypeShort,
      value: snakecaseKeys({
        ...protoParamsAmino,
        amount: '1000.000000000000000000',
      }),
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
