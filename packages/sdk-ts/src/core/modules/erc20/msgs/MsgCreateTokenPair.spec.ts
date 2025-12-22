import { EIP712Version } from '@injectivelabs/ts-types'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import MsgCreateTokenPair from './MsgCreateTokenPair.js'
import {
  getEip712TypedData,
  getEip712TypedDataV2,
} from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'

const params: MsgCreateTokenPair['params'] = {
  injectiveAddress: mockFactory.injectiveAddress,
  tokenPair: {
    denom: 'inj',
    erc20Address: '0x1234567890123456789012345678901234567890',
  },
}

const protoType = '/injective.erc20.v1beta1.MsgCreateTokenPair'
const protoTypeAmino = 'erc20/MsgCreateTokenPair'
const protoParams = {
  sender: params.injectiveAddress,
  tokenPair: {
    bankDenom: params.tokenPair.denom,
    erc20Address: params.tokenPair.erc20Address,
  },
}

const protoParamsAmino = {
  sender: params.injectiveAddress,
  token_pair: {
    bank_denom: params.tokenPair.denom,
    erc20_address: params.tokenPair.erc20Address,
  },
}

const message = MsgCreateTokenPair.fromJSON(params)

describe('MsgCreateTokenPair', () => {
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
