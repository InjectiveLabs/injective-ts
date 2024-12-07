import MsgGrantAllowance from './MsgGrantAllowance.js'
import { mockFactory } from '@injectivelabs/utils/test-utils'
import { CosmosFeegrantV1Beta1Feegrant } from '@injectivelabs/core-proto-ts'
import snakecaseKeys from 'snakecase-keys'

const { injectiveAddress, injectiveAddress2 } = mockFactory

const params: MsgGrantAllowance['params'] = {
  grantee: injectiveAddress,
  granter: injectiveAddress2,
  allowance: {
    spendLimit: [
      {
        denom: 'inj',
        amount: '1000',
      },
    ],
    expiration: 1679416772,
  },
}

const protoType = '/cosmos.feegrant.v1beta1.MsgGrantAllowance'
const protoTypeShort = 'cosmos-sdk/MsgGrantAllowance'
const protoParams = {
  grantee: params.grantee,
  granter: params.granter,
  allowance: {
    typeUrl: '/cosmos.feegrant.v1beta1.BasicAllowance',
    value: Uint8Array.from(
      CosmosFeegrantV1Beta1Feegrant.BasicAllowance.encode({
        spendLimit: params.allowance.spendLimit,
        expiration: new Date(params.allowance.expiration! * 1000),
      }).finish(),
    ),
  },
}

const protoParamsAmino = snakecaseKeys({
  grantee: params.grantee,
  granter: params.granter,
  allowance: {
    type: 'cosmos-sdk/BasicAllowance',
    value: {
      spendLimit: params.allowance.spendLimit,
      expiration: new Date(params.allowance.expiration! * 1000),
    },
  },
})

const protoParamsWeb3 = {
  grantee: params.grantee,
  granter: params.granter,
  allowance: {
    '@type': '/cosmos.feegrant.v1beta1.BasicAllowance',
    spendLimit: params.allowance.spendLimit,
    expiration: new Date(params.allowance.expiration! * 1000),
  },
}
const message = MsgGrantAllowance.fromJSON(params)

describe('MsgGrantAllowance', () => {
  it('generates proper proto', () => {
    const message = MsgGrantAllowance.fromJSON(params)
    const proto = message.toProto()

    expect(proto).toStrictEqual({
      ...protoParams,
    })
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
      value: protoParamsAmino,
    })
  })

  it('generates proper Eip712 types', () => {
    const eip712Types = message.toEip712Types()

    expect(Object.fromEntries(eip712Types)).toStrictEqual({
      TypeAllowance: [
        { name: 'type', type: 'string' },
        { name: 'value', type: 'TypeAllowanceValue' },
      ],
      TypeAllowanceValue: [
        { name: 'spend_limit', type: 'TypeAllowanceValueSpendLimit[]' },
        { name: 'expiration', type: 'string' },
      ],
      TypeAllowanceValueSpendLimit: [
        { name: 'denom', type: 'string' },
        { name: 'amount', type: 'string' },
      ],
      MsgValue: [
        { name: 'granter', type: 'string' },
        { name: 'grantee', type: 'string' },
        { name: 'allowance', type: 'TypeAllowance' },
      ],
    })
  })

  it('generates proper Eip712 values', () => {
    const eip712 = message.toEip712()

    expect(eip712).toStrictEqual({
      type: protoTypeShort,
      value: snakecaseKeys({
        ...protoParamsAmino,
        allowance: {
          ...protoParamsAmino.allowance,
          value: {
            ...protoParamsAmino.allowance.value,
            expiration:
              protoParamsAmino.allowance.value.expiration
                .toJSON()
                .split('.')[0] + 'Z',
          },
        },
      }),
    })
  })

  it('generates proper direct sign', () => {
    const directSign = message.toDirectSign()

    expect(directSign).toStrictEqual({
      type: protoType,
      message: protoParams,
    })
  })

  it('generates proper web3', () => {
    const web3 = message.toWeb3()

    expect(web3).toStrictEqual({
      '@type': protoType,
      ...protoParamsWeb3,
    })
  })
})
