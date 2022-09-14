import { MsgBeginRedelegate as BaseMsgBeginRedelegate } from '@injectivelabs/chain-api/cosmos/staking/v1beta1/tx_pb'
import { BigNumberInBase } from '@injectivelabs/utils'
import MsgBeginRedelegate from './MsgBeginRedelegate'

const params: MsgBeginRedelegate['params'] = {
  srcValidatorAddress: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm48',
  dstValidatorAddress: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49',
  injectiveAddress: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm50',
  amount: {
    amount: new BigNumberInBase(1).toFixed(),
    denom: 'inj',
  },
}

const message = MsgBeginRedelegate.fromJSON(params)

describe.only('MsgBeginRedelegate', () => {
  it('generates proper proto', () => {
    const proto = message.toProto()

    expect(proto instanceof BaseMsgBeginRedelegate).toBe(true)
    expect(proto.toObject()).toStrictEqual({
      validatorDstAddress: params.dstValidatorAddress,
      validatorSrcAddress: params.srcValidatorAddress,
      delegatorAddress: params.injectiveAddress,
      amount: params.amount,
    })
  })

  it('generates proper data', () => {
    const data = message.toData()

    expect(data).toStrictEqual({
      '@type': '/cosmos.staking.v1beta1.MsgBeginRedelegate',
      validatorDstAddress: params.dstValidatorAddress,
      validatorSrcAddress: params.srcValidatorAddress,
      delegatorAddress: params.injectiveAddress,
      amount: params.amount,
    })
  })

  it('generates proper amino', () => {
    const amino = message.toAmino()

    expect(amino).toStrictEqual({
      type: 'cosmos-sdk/MsgBeginRedelegate',
      validatorDstAddress: params.dstValidatorAddress,
      validatorSrcAddress: params.srcValidatorAddress,
      delegatorAddress: params.injectiveAddress,
      amount: params.amount,
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
        { name: 'delegator_address', type: 'string' },
        { name: 'validator_src_address', type: 'string' },
        { name: 'validator_dst_address', type: 'string' },
        { name: 'amount', type: 'TypeAmount' },
      ],
    })
  })

  it('generates proper Eip712 values', () => {
    const eip712 = message.toEip712()

    expect(eip712).toStrictEqual({
      type: 'cosmos-sdk/MsgBeginRedelegate',
      value: {
        validator_dst_address: params.dstValidatorAddress,
        validator_src_address: params.srcValidatorAddress,
        delegator_address: params.injectiveAddress,
        amount: params.amount,
      },
    })
  })

  it('generates proper web3', () => {
    const web3 = message.toWeb3()

    expect(web3).toStrictEqual({
      '@type': '/cosmos.staking.v1beta1.MsgBeginRedelegate',
      validatorDstAddress: params.dstValidatorAddress,
      validatorSrcAddress: params.srcValidatorAddress,
      delegatorAddress: params.injectiveAddress,
      amount: params.amount,
    })
  })
})
