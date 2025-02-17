import { EIP712Version } from '@injectivelabs/ts-types'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import { InjectivePermissionsV1Beta1Permissions } from '@injectivelabs/core-proto-ts'
import {
  getEip712TypedData,
  getEip712TypedDataV2,
} from '../../../tx/eip712/eip712.js'
import MsgCreateNamespace from './MsgCreateNamespace.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'

const params: MsgCreateNamespace['params'] = {
  sender: mockFactory.injectiveAddress,
  namespace: {
    denom: 'inj',
    contractHook: 'wasmHookAddress',
    rolePermissions: [{ name: 'admin', roleId: 1, permissions: 1 }],
    actorRoles: [{ actor: mockFactory.injectiveAddress2, roles: ['admin'] }],
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
  },
}

const message = MsgCreateNamespace.fromJSON(params)

describe('MsgCreateNamespace', () => {
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
