import { EIP712Version } from '@injectivelabs/ts-types'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import MsgUpdateRateLimit from './MsgUpdateRateLimit.js'
import { getEip712TypedDataV2 } from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from '../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'

const params: MsgUpdateRateLimit['params'] = {
  injectiveAddress: mockFactory.injectiveAddress,
  tokenAddress: 'inj',
  newTokenPriceId: '1234567890',
  newRateLimitInUsd: '1000000000000000000',
  newRateLimitWindow: '100',
}

const message = MsgUpdateRateLimit.fromJSON(params)

describe('MsgUpdateRateLimit', () => {
  describe('generates proper EIP712 compared to the Web3Gw (chain)', () => {
    const { endpoints, eip712Args, prepareEip712Request } = prepareEip712({
      messages: message,
    })

    test('EIP712 v1', async () => {
      expect(() => message.toEip712()).toThrow(
        'EIP712_v1 is not supported for MsgUpdateRateLimit. Please use EIP712_v2',
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
