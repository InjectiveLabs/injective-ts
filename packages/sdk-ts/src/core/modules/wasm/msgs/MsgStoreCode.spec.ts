import MsgStoreCode from './MsgStoreCode.js'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import { getEip712TypedDataV2 } from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'
import { EIP712Version } from '@injectivelabs/ts-types'
import { CosmwasmWasmV1Types } from '@injectivelabs/core-proto-ts'

const params: MsgStoreCode['params'] = {
  sender: mockFactory.injectiveAddress,
  wasmBytes: new Uint8Array([1, 2, 3]),
  instantiatePermission: {
    permission: CosmwasmWasmV1Types.AccessType.ACCESS_TYPE_ANY_OF_ADDRESSES,
    addresses: [mockFactory.injectiveAddress],
  },
}

const message = MsgStoreCode.fromJSON(params)

describe('MsgStoreCode', () => {
  describe('generates proper EIP712 compared to the Web3Gw (chain)', () => {
    const { endpoints, eip712Args, prepareEip712Request } = prepareEip712({
      messages: message,
    })

    it('EIP712 v1', async () => {
      expect(() => message.toEip712()).toThrow(
        'EIP712_v1 is not supported for MsgStoreCode. Please use EIP712_v2',
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
})
