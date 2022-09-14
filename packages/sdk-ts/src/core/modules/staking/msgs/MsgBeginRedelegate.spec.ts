import { MsgBeginRedelegate as BaseMsgBeginRedelegate } from '@injectivelabs/chain-api/cosmos/staking/v1beta1/tx_pb'
import { BigNumberInBase } from '@injectivelabs/utils'
import MsgBeginRedelegate from './MsgBeginRedelegate'
import { mockFactory } from '../../../../../../../tests/mocks'
import snakecaseKeys from 'snakecase-keys'

const params: MsgBeginRedelegate['params'] = {
  srcValidatorAddress: mockFactory.validatorAddress,
  dstValidatorAddress: mockFactory.validatorAddress2,
  injectiveAddress: mockFactory.injectiveAddress,
  amount: {
    amount: new BigNumberInBase(1).toFixed(),
    denom: 'inj',
  },
}

const protoType = '/cosmos.staking.v1beta1.MsgBeginRedelegate'
const protoTypeShort = 'cosmos-sdk/MsgBeginRedelegate'
const protoParams = {
  validatorDstAddress: params.dstValidatorAddress,
  validatorSrcAddress: params.srcValidatorAddress,
  delegatorAddress: params.injectiveAddress,
  amount: params.amount,
}

const message = MsgBeginRedelegate.fromJSON(params)

describe.only('MsgBeginRedelegate', () => {
  it('generates proper proto', () => {
    const proto = message.toProto()

    expect(proto instanceof BaseMsgBeginRedelegate).toBe(true)
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
      type: protoTypeShort,
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
        { name: 'validator_src_address', type: 'string' },
        { name: 'validator_dst_address', type: 'string' },
        { name: 'amount', type: 'TypeAmount' },
      ],
    })
  })

  it('generates proper Eip712 values', () => {
    const eip712 = message.toEip712()

    expect(eip712).toStrictEqual({
      type: protoTypeShort,
      value: snakecaseKeys(protoParams),
    })
  })

  it('generates proper web3', () => {
    const web3 = message.toWeb3()

    expect(web3).toStrictEqual({
      '@type': protoType,
      validatorDstAddress: params.dstValidatorAddress,
      validatorSrcAddress: params.srcValidatorAddress,
      delegatorAddress: params.injectiveAddress,
      amount: params.amount,
    })
  })
})
