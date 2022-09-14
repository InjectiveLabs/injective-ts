import { MsgDelegate as BaseMsgDelegate } from '@injectivelabs/chain-api/cosmos/staking/v1beta1/tx_pb'
import { BigNumberInBase } from '@injectivelabs/utils'
import MsgDelegate from './MsgDelegate'

const params: MsgDelegate['params'] = {
  validatorAddress: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm48',
  injectiveAddress: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49',
  amount: {
    amount: new BigNumberInBase(1).toFixed(),
    denom: 'inj',
  },
}

const message = MsgDelegate.fromJSON(params)

describe.only('MsgDelegate', () => {
  it('generates proper proto', () => {
    const proto = message.toProto()

    expect(proto instanceof BaseMsgDelegate).toBe(true)
    expect(proto.toObject()).toStrictEqual({
      validatorAddress: params.validatorAddress,
      delegatorAddress: params.injectiveAddress,
      amount: params.amount,
    })
  })

  it('generates proper data', () => {
    const data = message.toData()

    expect(data).toStrictEqual({
      '@type': '/cosmos.staking.v1beta1.MsgDelegate',
      validatorAddress: params.validatorAddress,
      delegatorAddress: params.injectiveAddress,
      amount: params.amount,
    })
  })

  it('generates proper amino', () => {
    const amino = message.toAmino()

    expect(amino).toStrictEqual({
      type: 'cosmos-sdk/MsgDelegate',
      validatorAddress: params.validatorAddress,
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
        { name: 'validator_address', type: 'string' },
        { name: 'amount', type: 'TypeAmount' },
      ],
    })
  })

  it('generates proper Eip712 values', () => {
    const eip712 = message.toEip712()

    expect(eip712).toStrictEqual({
      type: 'cosmos-sdk/MsgDelegate',
      value: {
        validator_address: params.validatorAddress,
        delegator_address: params.injectiveAddress,
        amount: params.amount,
      },
    })
  })

  it('generates proper web3', () => {
    const web3 = message.toWeb3()

    expect(web3).toStrictEqual({
      '@type': '/cosmos.staking.v1beta1.MsgDelegate',
      validatorAddress: params.validatorAddress,
      delegatorAddress: params.injectiveAddress,
      amount: params.amount,
    })
  })
})
