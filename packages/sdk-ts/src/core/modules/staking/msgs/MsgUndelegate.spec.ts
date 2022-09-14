import { MsgUndelegate as BaseMsgUndelegate } from '@injectivelabs/chain-api/cosmos/staking/v1beta1/tx_pb'
import { BigNumberInBase } from '@injectivelabs/utils'
import MsgUndelegate from './MsgUndelegate'
import { mockFactory } from '@tests/mocks'
import snakecaseKeys from 'snakecase-keys'

const params: MsgUndelegate['params'] = {
  validatorAddress: mockFactory.validatorAddress,
  injectiveAddress: mockFactory.injectiveAddress,
  amount: {
    amount: new BigNumberInBase(1).toFixed(),
    denom: 'inj',
  },
}

const protoType = '/cosmos.staking.v1beta1.MsgUndelegate'
const protoTypeAmino = 'cosmos-sdk/MsgUndelegate'
const protoParams = {
  validatorAddress: params.validatorAddress,
  delegatorAddress: params.injectiveAddress,
  amount: params.amount,
}

const message = MsgUndelegate.fromJSON(params)

describe.only('MsgUndelegate', () => {
  it('generates proper proto', () => {
    const proto = message.toProto()

    expect(proto instanceof BaseMsgUndelegate).toBe(true)
    expect(proto.toObject()).toStrictEqual(protoParams)
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
      ...protoParams,
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
      type: protoTypeAmino,
      value: snakecaseKeys(protoParams),
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
