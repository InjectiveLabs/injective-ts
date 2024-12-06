import MsgWithdrawDelegatorReward from './MsgWithdrawDelegatorReward.js'
import { mockFactory } from '@injectivelabs/utils/test-utils'
import snakecaseKeys from 'snakecase-keys'

const params: MsgWithdrawDelegatorReward['params'] = {
  delegatorAddress: mockFactory.injectiveAddress,
  validatorAddress: mockFactory.validatorAddress,
}

const protoType = '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward'
const protoTypeShort = 'cosmos-sdk/MsgWithdrawDelegationReward'
const protoParams = {
  delegatorAddress: params.delegatorAddress,
  validatorAddress: params.validatorAddress,
}
const aminoParams = snakecaseKeys(protoParams)

const message = MsgWithdrawDelegatorReward.fromJSON(params)

describe('MsgWithdrawDelegatorReward', () => {
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
      value: aminoParams,
    })
  })

  it('generates proper Eip712 types', () => {
    const eip712Types = message.toEip712Types()

    expect(Object.fromEntries(eip712Types)).toStrictEqual({
      MsgValue: [
        { name: 'delegator_address', type: 'string' },
        { name: 'validator_address', type: 'string' },
      ],
    })
  })

  it('generates proper Eip712 values', () => {
    const eip712 = message.toEip712()

    expect(eip712).toStrictEqual({
      type: protoTypeShort,
      value: aminoParams,
    })
  })

  it('generates proper web3', () => {
    const web3 = message.toWeb3()

    expect(web3).toStrictEqual({
      '@type': protoType,
      ...aminoParams,
    })
  })
})
