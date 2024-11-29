import { BigNumberInBase } from '@injectivelabs/utils'
import MsgSend from './MsgSend.js'
import { mockFactory } from '@injectivelabs/test-utils'

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
const protoParams = {
  toAddress: params.dstInjectiveAddress,
  fromAddress: params.srcInjectiveAddress,
  amount: [params.amount],
}
const protoParamsAmino = {
  to_address: params.dstInjectiveAddress,
  from_address: params.srcInjectiveAddress,
  amount: [params.amount],
}

const message = MsgSend.fromJSON(params)

describe('MsgSend', () => {
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
