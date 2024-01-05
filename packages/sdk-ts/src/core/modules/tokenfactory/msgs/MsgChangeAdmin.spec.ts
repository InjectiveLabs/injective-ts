import MsgChangeAdmin from './MsgChangeAdmin'
import { mockFactory } from '@injectivelabs/test-utils'
import snakecaseKeys from 'snakecase-keys'

const params: MsgChangeAdmin['params'] = {
  sender: mockFactory.injectiveAddress,
  denom: 'inj',
  newAdmin: mockFactory.injectiveAddress2,
}

const protoType = '/injective.tokenfactory.v1beta1.MsgChangeAdmin'
const protoTypeAmino = 'injective/tokenfactory/change-admin'
const protoParams = {
  sender: params.sender,
  denom: params.denom,
  newAdmin: params.newAdmin,
}

const protoParamsAmino = snakecaseKeys(protoParams)
const message = MsgChangeAdmin.fromJSON(params)

describe('MsgChangeAdmin', () => {
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
      MsgValue: [
        { name: 'sender', type: 'string' },
        { name: 'denom', type: 'string' },
        { name: 'new_admin', type: 'string' },
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
