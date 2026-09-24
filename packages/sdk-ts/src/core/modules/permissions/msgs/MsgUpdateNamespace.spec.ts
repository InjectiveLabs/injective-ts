import { EIP712Version } from '@injectivelabs/ts-types'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import * as InjectivePermissionsV1Beta1PermissionsPb from '@injectivelabs/core-proto-ts-v2/generated/injective/permissions/v1beta1/permissions_pb'
import MsgUpdateNamespace from './MsgUpdateNamespace.js'
import { getEip712TypedDataV2 } from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'

const params: MsgUpdateNamespace['params'] = {
  sender: mockFactory.injectiveAddress,
  denom: 'inj',
  evmHook: 'evm',
  wasmHook: 'wasm',
  rolePermissions: [{ name: 'admin', roleId: 1, permissions: 1 }],
  roleManagers: [
    {
      manager: mockFactory.injectiveAddress,
      roles: ['admin'],
    },
  ],
  policyStatuses: [
    {
      action: InjectivePermissionsV1Beta1PermissionsPb.Action.SEND,
      isDisabled: false,
      isSealed: false,
    },
  ],
  policyManagerCapabilities: [
    {
      manager: mockFactory.injectiveAddress2,
      action: InjectivePermissionsV1Beta1PermissionsPb.Action.SEND,
      canDisable: false,
      canSeal: false,
    },
  ],
}

const message = MsgUpdateNamespace.fromJSON(params)
const messageWithPostHook = MsgUpdateNamespace.fromJSON({
  ...params,
  evmPostHook: 'evm-post-hook',
})

describe('MsgUpdateNamespace', () => {
  it('serializes the EVM post hook', () => {
    expect(messageWithPostHook.toProto()).toMatchObject({
      evmPostHook: { newValue: 'evm-post-hook' },
    })
    expect(messageWithPostHook.toAmino().value).toMatchObject({
      evm_post_hook: { new_value: 'evm-post-hook' },
    })
    expect(messageWithPostHook.toWeb3Gw()).toMatchObject({
      evm_post_hook: { new_value: 'evm-post-hook' },
    })
    expect(messageWithPostHook.toEip712V2()).toMatchObject({
      evm_post_hook: { new_value: 'evm-post-hook' },
    })
  })

  describe('generates proper EIP712 compared to the Web3Gw (chain)', () => {
    const { endpoints, eip712Args, prepareEip712Request } = prepareEip712({
      messages: message,
    })

    it('EIP712 v1', async () => {
      expect(() => message.toEip712()).toThrow(
        'EIP712_v1 is not supported for MsgUpdateNamespace. Please use EIP712_v2',
      )
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

  describe('generates EIP712 v2 with the EVM post hook compared to the Web3Gw (chain)', () => {
    const { endpoints, eip712Args, prepareEip712Request } = prepareEip712({
      messages: messageWithPostHook,
    })

    it('EIP712 v2 - MsgUpdateNamespace with EVM post hook reaches Web3Gw', async () => {
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
