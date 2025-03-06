import MsgSetDenomMetadata from './MsgSetDenomMetadata.js'
import snakecaseKeys from 'snakecase-keys'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import {
  getEip712TypedData,
  getEip712TypedDataV2,
} from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'
import { EIP712Version } from '@injectivelabs/ts-types'

const params: MsgSetDenomMetadata['params'] = {
  sender: mockFactory.injectiveAddress,
  adminBurnDisabled: true,
  metadata: {
    symbol: 'TEST',
    display: 'factory/test',
    name: 'Test',
    decimals: 18,
    description: 'test description',
    uri: 'https://injective.com',
    uriHash: 'test',
    base: 'factory/test',
    denomUnits: [
      {
        denom: 'factory/test',
        exponent: 1,
        aliases: ['uinj'],
      },
    ],
  },
}

const protoType = '/injective.tokenfactory.v1beta1.MsgSetDenomMetadata'
const protoTypeAmino = 'injective/tokenfactory/set-denom-metadata'
const protoParams = {
  sender: params.sender,
  metadata: params.metadata,
  adminBurnDisabled: {
    shouldDisable: params.adminBurnDisabled,
  },
}

const protoParamsAmino = snakecaseKeys(protoParams)
const message = MsgSetDenomMetadata.fromJSON(params)

describe('MsgSetDenomMetadata', () => {
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
      type: protoTypeAmino,
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
