import MsgEditValidator from './MsgEditValidator.js'
import { mockFactory } from '@injectivelabs/utils/test-utils'
import snakecaseKeys from 'snakecase-keys'

const params: MsgEditValidator['params'] = {
  description: {
    moniker: 'Validator',
    identity: 'Validator',
    website: 'https://hub.injective.network',
    securityContact: 'example@email.com',
    details: 'Validator Details',
  },
  validatorAddress: mockFactory.validatorAddress,
  commissionRate: '0.01',
  minSelfDelegation: '0.01',
}

const protoType = '/cosmos.staking.v1beta1.MsgEditValidator'
const protoTypeAmino = 'cosmos-sdk/MsgEditValidator'
const protoParams = {
  commissionRate: params.minSelfDelegation,
  description: params.description,
  validatorAddress: mockFactory.validatorAddress,
  minSelfDelegation: params.minSelfDelegation,
}
const protoParamsAmino = snakecaseKeys(protoParams)
const message = MsgEditValidator.fromJSON(params)

describe('MsgEditValidator', () => {
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
      TypeDescription: [
        { name: 'moniker', type: 'string' },
        { name: 'identity', type: 'string' },
        { name: 'website', type: 'string' },
        { name: 'security_contact', type: 'string' },
        { name: 'details', type: 'string' },
      ],
      MsgValue: [
        { name: 'description', type: 'TypeDescription' },
        { name: 'validator_address', type: 'string' },
        { name: 'commission_rate', type: 'string' },
        { name: 'min_self_delegation', type: 'string' },
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
