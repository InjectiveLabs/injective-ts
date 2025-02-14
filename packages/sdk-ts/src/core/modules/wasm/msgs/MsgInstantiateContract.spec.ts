import MsgInstantiateContract from './MsgInstantiateContract.js'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import { getEip712TypedDataV2 } from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'
import { EIP712Version } from '@injectivelabs/ts-types'

const params: MsgInstantiateContract['params'] = {
  sender: mockFactory.injectiveAddress,
  admin: mockFactory.injectiveAddress,
  codeId: 1,
  label: 'test',
  msg: {
    test: 'test',
  },
  amount: {
    denom: 'inj',
    amount: '1000000000000000000',
  },
}

const message = MsgInstantiateContract.fromJSON(params)

describe('MsgInstantiateContract', () => {
  describe('generates proper EIP712 compared to the Web3Gw (chain)', () => {
    const { endpoints, eip712Args, prepareEip712Request } = prepareEip712({
      messages: message,
    })

    it('EIP712 v1', async () => {
      expect(() => message.toEip712()).toThrow(
        'EIP712_v1 is not supported for MsgInstantiateContract. Please use EIP712_v2',
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
