import snakecaseKeys from 'snakecase-keys'
import MsgUpdateNamespaceRoles from './MsgUpdateNamespaceRoles'
import { mockFactory } from '@injectivelabs/test-utils'

const params: MsgUpdateNamespaceRoles['params'] = {
  sender: mockFactory.injectiveAddress,
  namespaceDenom: 'namespace_denom',
  rolePermissions: [{ role: 'admin', permissions: 1 }],
  addressRoles: [{ address: mockFactory.injectiveAddress2, roles: ['admin'] }],
}

const protoType = '/injective.permissions.v1beta1.MsgUpdateNamespaceRoles'
const protoTypeShort = 'permissions/MsgUpdateNamespaceRoles'
const protoParams = {
  sender: params.sender,
  namespaceDenom: params.namespaceDenom,
  rolePermissions: params.rolePermissions.map((rp) => ({
    role: rp.role,
    permissions: rp.permissions,
  })),
  addressRoles: params.addressRoles.map((ar) => ({
    address: ar.address,
    roles: ar.roles,
  })),
}

const protoParamsAmino = snakecaseKeys(protoParams)
const message = MsgUpdateNamespaceRoles.fromJSON(params)

describe('MsgUpdateNamespaceRoles', () => {
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
