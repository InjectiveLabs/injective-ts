import snakecaseKeys from 'snakecase-keys'
import MsgRevokeNamespaceRoles from './MsgRevokeNamespaceRoles'
import { mockFactory } from '@injectivelabs/test-utils'

const params: MsgRevokeNamespaceRoles['params'] = {
  sender: mockFactory.injectiveAddress,
  namespaceDenom: 'namespace_denom',
  addressRolesToRevoke: [{ address: mockFactory.injectiveAddress2, roles: ['admin'] }],
}

const protoType = '/injective.permissions.v1beta1.MsgRevokeNamespaceRoles'
const protoTypeShort = 'permissions/MsgRevokeNamespaceRoles'
const protoParams = {
  sender: params.sender,
  namespaceDenom: params.namespaceDenom,
  addressRolesToRevoke: params.addressRolesToRevoke.map((ar) => ({
    address: ar.address,
    roles: ar.roles,
  })),
}

const protoParamsAmino = snakecaseKeys(protoParams)
const message = MsgRevokeNamespaceRoles.fromJSON(params)

describe('MsgRevokeNamespaceRoles', () => {
  it('generates proper proto', () => {
    const proto = message.toProto()

    expect(proto).toStrictEqual({
      ...protoParams
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

  it('generates proper web3', () => {
    const web3 = message.toWeb3()

    expect(web3).toStrictEqual({
      '@type': protoType,
      ...protoParamsAmino,
    })
  })
})
