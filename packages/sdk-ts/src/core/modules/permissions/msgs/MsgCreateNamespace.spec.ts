import snakecaseKeys from 'snakecase-keys'
import MsgCreateNamespace from './MsgCreateNamespace'
import { mockFactory } from '@injectivelabs/test-utils'

const params: MsgCreateNamespace['params'] = {
  sender: mockFactory.injectiveAddress,
  namespace: {
    denom: 'inj',
    wasmHook: 'wasmHookAddress',
    mintsPaused: true,
    sendsPaused: false,
    burnsPaused: true,
    rolePermissions: [{ role: 'admin', permissions: 1 }],
    addressRoles: [{ address: mockFactory.injectiveAddress2, roles: ['admin'] }],
  }
}

const protoType = '/injective.permissions.v1beta1.MsgCreateNamespace'
const protoTypeShort = 'permissions/MsgCreateNamespace'
const protoParams = {
  sender: params.sender,
  namespace: {
    denom: params.namespace.denom,
    wasmHook: params.namespace.wasmHook,
    mintsPaused: params.namespace.mintsPaused,
    sendsPaused: params.namespace.sendsPaused,
    burnsPaused: params.namespace.burnsPaused,
    rolePermissions: params.namespace.rolePermissions.map((rp) => ({
      role: rp.role,
      permissions: rp.permissions,
    })),
    addressRoles: params.namespace.addressRoles.map((ar) => ({
      address: ar.address,
      roles: ar.roles,
    })),
  },
}

const protoParamsAmino = snakecaseKeys(protoParams)
const message = MsgCreateNamespace.fromJSON(params)

describe('MsgCreateNamespace', () => {
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

  it('generates proper web3', () => {
    const web3 = message.toWeb3()

    expect(web3).toStrictEqual({
      '@type': protoType,
      ...protoParamsAmino,
    })
  })
})
