import { MsgSend as BaseMsgSend } from '@injectivelabs/chain-api/cosmos/bank/v1beta1/tx_pb'
import { BigNumberInBase } from '@injectivelabs/utils'
import MsgSend from './MsgSend'
import { mockFactory } from '../../../../../../../tests/mocks'

const params: MsgSend['params'] = {
  dstInjectiveAddress: mockFactory.injectiveAddress,
  srcInjectiveAddress: mockFactory.injectiveAddress2,
  amount: {
    amount: new BigNumberInBase(1).toFixed(),
    denom: 'inj',
  },
}

const protoType = '/cosmos.bank.v1beta1.MsgSend'
const protoTypeShort = 'cosmos-sdk/MsgSend'
const protoParamsBefore = {
  toAddress: params.dstInjectiveAddress,
  fromAddress: params.srcInjectiveAddress,
  amountList: [params.amount],
}
const protoParamsAfter = {
  to_address: params.dstInjectiveAddress,
  from_address: params.srcInjectiveAddress,
  amount: [params.amount],
}

const message = MsgSend.fromJSON(params)

describe.only('MsgSend', () => {
  it('generates proper proto', () => {
    const proto = message.toProto()

    expect(proto instanceof BaseMsgSend).toBe(true)
    expect(proto.toObject()).toStrictEqual(protoParamsBefore)
  })

  it('generates proper data', () => {
    const data = message.toData()

    expect(data).toStrictEqual({
      '@type': protoType,
      ...protoParamsBefore,
    })
  })

  it('generates proper amino', () => {
    const amino = message.toAmino()

    expect(amino).toStrictEqual({
      type: protoTypeShort,
      ...protoParamsAfter,
    })
  })

  it('generates proper Eip712 types', () => {
    const eip712Types = message.toEip712Types()

    expect(Object.fromEntries(eip712Types)).toStrictEqual({
      TypeAmount: [
        { name: 'denom', type: 'string' },
        { name: 'amount', type: 'string' },
      ],
      MsgValue: [
        { name: 'from_address', type: 'string' },
        { name: 'to_address', type: 'string' },
        { name: 'amount', type: 'TypeAmount[]' },
      ],
    })
  })

  it('generates proper Eip712 values', () => {
    const eip712 = message.toEip712()

    expect(eip712).toStrictEqual({
      type: protoTypeShort,
      value: protoParamsAfter,
    })
  })

  it('generates proper web3', () => {
    const web3 = message.toWeb3()

    expect(web3).toStrictEqual({
      '@type': protoType,
      ...protoParamsAfter,
    })
  })
})
