import { mockFactory, prepareEip712 } from '@injectivelabs/test-utils'
import { InjectivePermissionsV1Beta1Permissions } from '@injectivelabs/core-proto-ts'
import MsgUpdateNamespace from './MsgUpdateNamespace.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client'
import { getEip712TypedData, getEip712TypedDataV2 } from '../../../tx/index.js'

const params: MsgUpdateNamespace['params'] = {
  sender: mockFactory.injectiveAddress,
  denom: 'inj',
  contractHook: 'wasm',
  rolePermissions: [{ name: 'admin', roleId: 1, permissions: 1 }],
  roleManagers: [
    {
      manager: mockFactory.injectiveAddress,
      roles: ['admin'],
    },
  ],
  policyStatuses: [
    {
      action: InjectivePermissionsV1Beta1Permissions.Action.SEND,
      isDisabled: false,
      isSealed: false,
    },
  ],
  policyManagerCapabilities: [
    {
      manager: mockFactory.injectiveAddress2,
      action: InjectivePermissionsV1Beta1Permissions.Action.SEND,
      canDisable: false,
      canSeal: false,
    },
  ],
}

const message = MsgUpdateNamespace.fromJSON(params)

describe('MsgUpdateNamespace', () => {
  describe('generates proper EIP712 compared to the Web3Gw (chain)', () => {
    const { endpoints, eip712Args, prepareEip712Request } = prepareEip712({
      sequence: 0,
      accountNumber: 3,
      messages: message,
    })

    it('EIP712 v1', async () => {
      const eip712TypedData = getEip712TypedData(eip712Args)

      const txResponse = await new IndexerGrpcWeb3GwApi(
        endpoints.indexer,
      ).prepareEip712Request({
        ...prepareEip712Request,
        eip712Version: 'v1',
      })

      expect(eip712TypedData).toStrictEqual(JSON.parse(txResponse.data))
    })

    it('EIP712 v2', async () => {
      const eip712TypedData = getEip712TypedDataV2(eip712Args)

      const txResponse = await new IndexerGrpcWeb3GwApi(
        endpoints.indexer,
      ).prepareEip712Request({ ...prepareEip712Request, eip712Version: 'v2' })

      expect(eip712TypedData).toStrictEqual(JSON.parse(txResponse.data))
    })
  })
})
