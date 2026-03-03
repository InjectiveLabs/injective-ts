import { EIP712Version } from '@injectivelabs/ts-types'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import MsgRelayProviderPrices from './MsgRelayProviderPrices.js'
import { getEip712TypedDataV2 } from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from '../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'

const params: MsgRelayProviderPrices['params'] = {
  sender: mockFactory.injectiveAddress,
  provider: 'InjectiveLabs',
  symbols: ['inj'],
  prices: ['3'],
}

const protoType = '/injective.oracle.v1beta1.MsgRelayProviderPrices'
const protoTypeShort = 'oracle/MsgRelayProviderPrices'
const protoParams = {
  sender: params.sender,
  provider: params.provider,
  symbols: params.symbols,
  prices: params.prices,
}
const protoParamsAmino = {
  sender: params.sender,
  provider: params.provider,
  symbols: params.symbols,
  prices: params.prices,
}

const message = MsgRelayProviderPrices.fromJSON(params)

describe('MsgRelayProviderPrices', () => {
  it('generates proper proto', () => {
    const proto = message.toProto()

    expect(proto).toStrictEqual(protoParams)
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
      expect(() => message.toEip712()).toThrow(
        'EIP712_v1 is not supported for MsgRelayProviderPrices. Please use EIP712_v2',
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
