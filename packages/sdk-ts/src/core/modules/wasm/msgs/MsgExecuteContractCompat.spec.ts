import { EIP712Version } from '@injectivelabs/ts-types'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import MsgExecuteContractCompat from './MsgExecuteContractCompat.js'
import {
  getEip712TypedData,
  getEip712TypedDataV2,
} from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'

const params: MsgExecuteContractCompat['params'] = {
  sender: mockFactory.injectiveAddress,
  contractAddress: mockFactory.injectiveAddress,
  funds: {
    denom: 'inj',
    amount: '1000000000000000000',
  },
  exec: {
    action: 'test',
    msg: {
      test: 'test',
    },
  },
}

const message = MsgExecuteContractCompat.fromJSON(params)

describe('MsgExecuteContractCompat', () => {
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

  describe('handles BigInt values in message', () => {
    it('should serialize BigInt values without throwing', () => {
      const paramsWithBigInt: MsgExecuteContractCompat['params'] = {
        sender: mockFactory.injectiveAddress,
        contractAddress: mockFactory.injectiveAddress,
        msg: {
          amount: BigInt('1000000000000000000'),
          nested: {
            value: BigInt(12345),
          },
        },
      }

      const messageWithBigInt =
        MsgExecuteContractCompat.fromJSON(paramsWithBigInt)

      // Should not throw "Do not know how to serialize a BigInt"
      expect(() => messageWithBigInt.toProto()).not.toThrow()
      expect(() => messageWithBigInt.toAmino()).not.toThrow()

      const proto = messageWithBigInt.toProto()
      expect(proto.msg).toContain('1000000000000000000')
      expect(proto.msg).toContain('12345')
    })
  })
})
