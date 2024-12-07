import { BigNumberInBase } from '@injectivelabs/utils'
import MsgCancelUnbondingDelegation from './MsgCancelUnbondingDelegation.js'
import { mockFactory } from '@injectivelabs/utils/test-utils'
import snakecaseKeys from 'snakecase-keys'

const params: MsgCancelUnbondingDelegation['params'] = {
  validatorAddress: mockFactory.validatorAddress,
  delegatorAddress: mockFactory.injectiveAddress,
  amount: {
    amount: new BigNumberInBase(1).toFixed(),
    denom: 'inj',
  },
  creationHeight: '123456',
}

const protoType = '/cosmos.staking.v1beta1.MsgCancelUnbondingDelegation'
const protoTypeAmino = 'cosmos-sdk/MsgCancelUnbondingDelegation'
const protoParams = {
  validatorAddress: params.validatorAddress,
  delegatorAddress: params.delegatorAddress,
  amount: params.amount,
  creationHeight: params.creationHeight,
}
const protoParamsAmino = snakecaseKeys(protoParams)
const message = MsgCancelUnbondingDelegation.fromJSON(params)

describe('MsgCancelUnbondingDelegation', () => {
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
      type: protoTypeAmino,
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
        { name: 'delegator_address', type: 'string' },
        { name: 'validator_address', type: 'string' },
        { name: 'amount', type: 'TypeAmount' },
        { name: 'creation_height', type: 'int64' },
      ],
    })
  })

  it('generates proper Eip712 values', () => {
    const eip712 = message.toEip712()

    expect(eip712).toStrictEqual({
      type: protoTypeAmino,
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
