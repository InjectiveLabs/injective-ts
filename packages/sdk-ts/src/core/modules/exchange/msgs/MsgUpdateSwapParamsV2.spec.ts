import { EIP712Version } from '@injectivelabs/ts-types'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import MsgUpdateSwapParamsV2 from './MsgUpdateSwapParamsV2.js'
import {
  getEip712TypedData,
  getEip712TypedDataV2,
} from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'

const params: MsgUpdateSwapParamsV2['params'] = {
  sender: mockFactory.injectiveAddress,
  swapParams: {
    enabled: true,
    allowedMarkets: ['0xmarket'],
  },
}

const message = MsgUpdateSwapParamsV2.fromJSON(params)
const protoType = '/injective.exchange.v2.MsgUpdateSwapParams'
const protoTypeShort = 'exchange/MsgUpdateSwapParams'
const aminoValue = {
  sender: params.sender,
  swap_params: {
    enabled: params.swapParams.enabled,
    allowed_markets: params.swapParams.allowedMarkets,
  },
}

describe('MsgUpdateSwapParamsV2', () => {
  it('generates proper proto', () => {
    expect(message.toProto()).toStrictEqual(params)
  })

  it('generates proper data', () => {
    expect(message.toData()).toStrictEqual({
      '@type': protoType,
      ...params,
    })
  })

  it('generates proper amino', () => {
    expect(message.toAmino()).toStrictEqual({
      type: protoTypeShort,
      value: aminoValue,
    })
  })

  it('generates proper web3Gw and EIP712 v2', () => {
    expect(message.toWeb3Gw()).toStrictEqual({
      '@type': protoType,
      ...aminoValue,
    })
    expect(message.toEip712V2()).toStrictEqual({
      '@type': protoType,
      ...aminoValue,
    })
  })

  it('generates proper EIP712 v1', () => {
    expect(message.toEip712()).toStrictEqual({
      type: protoTypeShort,
      value: aminoValue,
    })
  })

  describe('generates proper EIP712 compared to the Web3Gw (chain)', () => {
    const { endpoints, eip712Args, prepareEip712Request } = prepareEip712({
      messages: message,
    })

    it('EIP712 v1 - MsgUpdateSwapParams reaches Web3Gw', async () => {
      const eip712TypedData = getEip712TypedData(eip712Args)
      const txResponse = await new IndexerGrpcWeb3GwApi(
        endpoints.indexer,
      ).prepareEip712Request({
        ...prepareEip712Request,
        eip712Version: EIP712Version.V1,
      })

      expect(eip712TypedData).toStrictEqual(JSON.parse(txResponse.data))
    })

    it('EIP712 v2 - MsgUpdateSwapParams reaches Web3Gw', async () => {
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
