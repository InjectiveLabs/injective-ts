import MsgRevoke from './MsgRevoke.js'
import { mockFactory } from '@injectivelabs/test-utils'
import snakecaseKeys from 'snakecase-keys'

const { injectiveAddress, injectiveAddress2 } = mockFactory

const params: MsgRevoke['params'] = {
  grantee: injectiveAddress,
  granter: injectiveAddress2,
  messageType: '/cosmos.bank.v1beta1.MsgSend',
}

const protoType = '/cosmos.authz.v1beta1.MsgRevoke'
const protoTypeShort = 'cosmos-sdk/MsgRevoke'
const protoParams = {
  grantee: params.grantee,
  granter: params.granter,
  msgTypeUrl: '/cosmos.bank.v1beta1.MsgSend',
}

const protoParamsAmino = snakecaseKeys({
  grantee: params.grantee,
  granter: params.granter,
  msgTypeUrl: '/cosmos.bank.v1beta1.MsgSend',
})
const message = MsgRevoke.fromJSON(params)

describe('MsgRevoke', () => {
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
      MsgValue: [
        { name: 'granter', type: 'string' },
        { name: 'grantee', type: 'string' },
        { name: 'msg_type_url', type: 'string' },
      ],
    })
  })

  it('generates proper Eip712 values', () => {
    const eip712 = message.toEip712()

    expect(eip712).toStrictEqual({
      type: protoTypeShort,
      value: snakecaseKeys({
        ...protoParamsAmino,
      }),
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
