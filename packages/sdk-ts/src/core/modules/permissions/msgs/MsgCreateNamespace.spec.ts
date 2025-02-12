import snakecaseKeys from 'snakecase-keys'
import MsgCreateNamespace from './MsgCreateNamespace.js'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import {
  getEip712TypedData,
  getEip712TypedDataV2,
} from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'
import { EIP712Version } from '@injectivelabs/ts-types'

const params: MsgCreateNamespace['params'] = {
  sender: mockFactory.injectiveAddress,
  namespace: {
    denom: 'inj',
    wasmHook: 'wasmHookAddress',
    mintsPaused: true,
    sendsPaused: false,
    burnsPaused: true,
    rolePermissions: [{ role: 'admin', permissions: 1 }],
    addressRoles: [
      { address: mockFactory.injectiveAddress2, roles: ['admin'] },
    ],
  },
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

  it('generates proper web3Gw', () => {
    const web3 = message.toWeb3Gw()

    expect(web3).toStrictEqual({
      '@type': protoType,
      ...protoParamsAmino,
    })
  })


  describe('generates proper EIP712 compared to the Web3Gw (chain)', () => {
    const { endpoints, eip712Args, prepareEip712Request } = prepareEip712({
      messages: message,
    })

    it('EIP712 v1', async () => {
      const eip712TypedData = getEip712TypedData(eip712Args)

      const txResponse = await new IndexerGrpcWeb3GwApi(
        endpoints.indexer,
      ).prepareEip712Request({
        ...prepareEip712Request,
        eip712Version: EIP712Version.V1,
      })

      expect(eip712TypedData).toStrictEqual(JSON.parse(txResponse.data))
    })

    it('EIP712 v2', async () => {
      const eip712TypedData = getEip712TypedDataV2(eip712Args)

      const txResponse = await new IndexerGrpcWeb3GwApi(
        endpoints.indexer,
      ).prepareEip712Request({
        ...prepareEip712Request,
        eip712Version: EIP712Version.V2,
      })

      expect(eip712TypedData).toStrictEqual(JSON.parse(txResponse.data))
    })
  })
})
