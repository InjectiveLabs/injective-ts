import { BigNumberInBase } from '@injectivelabs/utils'
import MsgBeginRedelegate from './MsgBeginRedelegate.js'
import { mockFactory } from '@injectivelabs/test-utils'
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
const protoTypeAmino = 'cosmos-sdk/MsgBeginRedelegate'
const protoParams = {
  validatorDstAddress: params.dstValidatorAddress,
  validatorSrcAddress: params.srcValidatorAddress,
  delegatorAddress: params.injectiveAddress,
  amount: params.amount,
}
const protoParamsAmino = snakecaseKeys(protoParams)
const message = MsgBeginRedelegate.fromJSON(params)

describe('MsgBeginRedelegate', () => {
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
        { name: 'validator_src_address', type: 'string' },
        { name: 'validator_dst_address', type: 'string' },
        { name: 'amount', type: 'TypeAmount' },
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
