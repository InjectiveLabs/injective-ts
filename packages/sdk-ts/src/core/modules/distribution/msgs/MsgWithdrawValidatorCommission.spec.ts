import MsgWithdrawValidatorCommission from './MsgWithdrawValidatorCommission.js'
import { mockFactory } from '@injectivelabs/test-utils'
import snakecaseKeys from 'snakecase-keys'

const params: MsgWithdrawValidatorCommission['params'] = {
  validatorAddress: mockFactory.validatorAddress,
}

const protoType = '/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission'
const protoTypeShort = 'cosmos-sdk/MsgWithdrawDelegationReward'
const protoParams = {
  validatorAddress: params.validatorAddress,
}
const aminoParams = snakecaseKeys(protoParams)

const message = MsgWithdrawValidatorCommission.fromJSON(params)

describe('MsgWithdrawValidatorCommission', () => {
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
      MsgValue: [{ name: 'validator_address', type: 'string' }],
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
