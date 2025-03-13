import MsgGrantAllowance from './MsgGrantAllowance.js'
import { CosmosFeegrantV1Beta1Feegrant } from '@injectivelabs/core-proto-ts'
import snakecaseKeys from 'snakecase-keys'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import {
  getEip712TypedData,
  getEip712TypedDataV2,
} from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'
import { EIP712Version } from '@injectivelabs/ts-types'

const { injectiveAddress, injectiveAddress2 } = mockFactory

const params: MsgGrantAllowance['params'] = {
  grantee: injectiveAddress,
  granter: injectiveAddress2,
  allowance: {
    spendLimit: [
      {
        denom: 'inj',
        amount: '1000',
      },
    ],
    expiration: 1679416772,
  },
}

const protoType = '/cosmos.feegrant.v1beta1.MsgGrantAllowance'
const protoTypeShort = 'cosmos-sdk/MsgGrantAllowance'
const protoParams = {
  grantee: params.grantee,
  granter: params.granter,
  allowance: {
    typeUrl: '/cosmos.feegrant.v1beta1.BasicAllowance',
    value: Uint8Array.from(
      CosmosFeegrantV1Beta1Feegrant.BasicAllowance.encode({
        spendLimit: params.allowance.spendLimit,
        expiration: new Date(params.allowance.expiration! * 1000),
      }).finish(),
    ),
  },
}

const protoParamsAmino = snakecaseKeys({
  grantee: params.grantee,
  granter: params.granter,
  allowance: {
    type: 'cosmos-sdk/BasicAllowance',
    value: {
      spendLimit: params.allowance.spendLimit,
      expiration: new Date(params.allowance.expiration! * 1000)
        .toISOString()
        .replace('.000Z', 'Z'),
    },
  },
})

const protoParamsWeb3 = {
  grantee: params.grantee,
  granter: params.granter,
  allowance: {
    '@type': '/cosmos.feegrant.v1beta1.BasicAllowance',
    spendLimit: params.allowance.spendLimit,
    expiration: new Date(params.allowance.expiration! * 1000)
      .toISOString()
      .replace('.000Z', 'Z'),
  },
}
const message = MsgGrantAllowance.fromJSON(params)

describe('MsgGrantAllowance', () => {
  it('generates proper proto', () => {
    const message = MsgGrantAllowance.fromJSON(params)
    const proto = message.toProto()

    expect(proto).toStrictEqual({
      ...protoParams,
    })
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

  it('generates proper direct sign', () => {
    const directSign = message.toDirectSign()

    expect(directSign).toStrictEqual({
      type: protoType,
      message: protoParams,
    })
  })

  it('generates proper web3Gw', () => {
    const web3 = message.toWeb3Gw()

    expect(web3).toStrictEqual({
      '@type': protoType,
      ...protoParamsWeb3,
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
