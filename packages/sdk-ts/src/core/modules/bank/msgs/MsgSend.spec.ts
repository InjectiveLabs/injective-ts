import { MsgSend as BaseMsgSend } from '@injectivelabs/chain-api/cosmos/bank/v1beta1/tx_pb'
import { BigNumberInBase } from '@injectivelabs/utils'
import MsgSend from './MsgSend'

const params: MsgSend['params'] = {
  dstInjectiveAddress: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm48',
  srcInjectiveAddress: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49',
  amount: {
    amount: new BigNumberInBase(1).toFixed(),
    denom: 'inj',
  },
}

const message = MsgSend.fromJSON(params)

describe.only('MsgSend', () => {
  it('generates proper proto', () => {
    const proto = message.toProto()

    expect(proto instanceof BaseMsgSend).toBe(true)
    expect(proto.toObject()).toStrictEqual({
      toAddress: params.dstInjectiveAddress,
      fromAddress: params.srcInjectiveAddress,
      amountList: [params.amount],
    })
  })

  it('generates proper data', () => {
    const data = message.toData()

    expect(data).toStrictEqual({
      '@type': '/cosmos.bank.v1beta1.MsgSend',
      toAddress: params.dstInjectiveAddress,
      fromAddress: params.srcInjectiveAddress,
      amountList: [params.amount],
    })
  })

  it('generates proper amino', () => {
    const amino = message.toAmino()

    expect(amino).toStrictEqual({
      type: 'cosmos-sdk/MsgSend',
      to_address: params.dstInjectiveAddress,
      from_address: params.srcInjectiveAddress,
      amount: [params.amount],
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
      type: 'cosmos-sdk/MsgSend',
      value: {
        to_address: params.dstInjectiveAddress,
        from_address: params.srcInjectiveAddress,
        amount: [params.amount],
      },
    })
  })

  it('generates proper web3', () => {
    const web3 = message.toWeb3()

    expect(web3).toStrictEqual({
      '@type': '/cosmos.bank.v1beta1.MsgSend',
      to_address: params.dstInjectiveAddress,
      from_address: params.srcInjectiveAddress,
      amount: [params.amount],
    })
  })
})
