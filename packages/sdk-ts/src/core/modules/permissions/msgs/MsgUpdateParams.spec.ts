import { Network } from '@injectivelabs/networks'
import { EIP712Version } from '@injectivelabs/ts-types'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import MsgUpdateParams from './MsgUpdateParams.js'
import {
  getEip712TypedData,
  getEip712TypedDataV2,
} from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'

const params: MsgUpdateParams['params'] = {
  authority: mockFactory.injectiveAddress,
  params: {
    wasmHookQueryMaxGas: '50000',
    ownerBlacklistQueryMaxGas: '200000',
  },
}

const message = MsgUpdateParams.fromJSON(params)

describe('MsgUpdateParams', () => {
  it('sends ownerBlacklistQueryMaxGas in proto, amino and web3Gw (required by chain v1.21)', () => {
    expect(message.toProto().params?.ownerBlacklistQueryMaxGas).toBe(200000n)
    expect(message.toAmino().value.params.owner_blacklist_query_max_gas).toBe(
      '200000',
    )
    expect(
      (message.toWeb3Gw() as any).params.owner_blacklist_query_max_gas,
    ).toBe('200000')
  })

  describe('generates proper EIP712 compared to the Web3Gw (chain)', () => {
    const { endpoints, eip712Args, prepareEip712Request } = prepareEip712({
      // TODO: switch to Network.Mainnet after the v1.21 mainnet upgrade
      network: Network.Testnet,
      messages: message,
    })

    // TODO: EIP712 v1 type inference cannot handle empty arrays in params
    it.skip('EIP712 v1', async () => {
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
