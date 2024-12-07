import MsgGrant from './MsgGrant.js'
import { mockFactory } from '@injectivelabs/utils/test-utils'
import snakecaseKeys from 'snakecase-keys'

const { injectiveAddress, injectiveAddress2 } = mockFactory

const params: MsgGrant['params'] = {
  grantee: injectiveAddress,
  granter: injectiveAddress2,
  messageType: '/cosmos.bank.v1beta1.MsgSend',
  expiration: 1679416772,
}

const protoType = '/cosmos.authz.v1beta1.MsgGrant'
const protoTypeShort = 'cosmos-sdk/MsgGrant'
const protoParams = {
  grantee: params.grantee,
  granter: params.granter,
  grant: {
    authorization: {
      typeUrl: '/cosmos.authz.v1beta1.GenericAuthorization',
      value: Uint8Array.from(
        Buffer.from('ChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5k', 'base64'),
      ),
    },
    expiration: new Date(params.expiration! * 1000),
  },
}

const protoParamsAmino = snakecaseKeys({
  grantee: params.grantee,
  granter: params.granter,
  grant: {
    authorization: {
      type: 'cosmos-sdk/GenericAuthorization',
      value: {
        msg: params.messageType,
      },
    },
    expiration: new Date(params.expiration! * 1000),
  },
})
const protoParamsWeb3 = {
  grantee: params.grantee,
  granter: params.granter,
  grant: {
    authorization: {
      '@type': '/cosmos.authz.v1beta1.GenericAuthorization',
      msg: params.messageType,
    },
    expiration: new Date(params.expiration! * 1000),
  },
}
const message = MsgGrant.fromJSON(params)

describe('MsgGrant', () => {
  it('generates proper proto', () => {
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
      TypeGrant: [
        { name: 'authorization', type: 'TypeGrantAuthorization' },
        { name: 'expiration', type: 'string' },
      ],
      TypeGrantAuthorization: [
        { name: 'type', type: 'string' },
        { name: 'value', type: 'TypeGrantAuthorizationValue' },
      ],
      TypeGrantAuthorizationValue: [{ name: 'msg', type: 'string' }],
      MsgValue: [
        { name: 'granter', type: 'string' },
        { name: 'grantee', type: 'string' },
        { name: 'grant', type: 'TypeGrant' },
      ],
    })
  })

  it('generates proper Eip712 values', () => {
    const eip712 = message.toEip712()

    expect(eip712).toStrictEqual({
      type: protoTypeShort,
      value: snakecaseKeys({
        ...protoParamsAmino,
        grant: {
          ...protoParamsAmino.grant,
          expiration:
            protoParamsAmino.grant.expiration.toJSON().split('.')[0] + 'Z',
        },
      }),
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
