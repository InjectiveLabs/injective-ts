import snakecaseKeys from 'snakecase-keys'
import { EIP712Version } from '@injectivelabs/ts-types'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import MsgGrant from './MsgGrant.js'
import {
  getEip712TypedData,
  getEip712TypedDataV2,
} from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'

const { injectiveAddress, injectiveAddress2 } = mockFactory

const params: MsgGrant['params'] = {
  grantee: injectiveAddress,
  granter: injectiveAddress2,
  messageType: '/cosmos.bank.v1beta1.MsgSend',
  expiration: 1679416772,
}

const protoType = '/cosmos.authz.v1beta1.MsgGrant'
const protoTypeShort = 'cosmos-sdk/MsgGrant'
const protoParams = {
  grantee: params.grantee,
  granter: params.granter,
  grant: {
    authorization: {
      typeUrl: '/cosmos.authz.v1beta1.GenericAuthorization',
      value: Uint8Array.from(
        Buffer.from('ChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5k', 'base64'),
      ),
    },
    expiration: new Date(params.expiration! * 1000),
  },
}

const protoParamsAmino = snakecaseKeys({
  grantee: params.grantee,
  granter: params.granter,
  grant: {
    authorization: {
      type: 'cosmos-sdk/GenericAuthorization',
      value: {
        msg: params.messageType,
      },
    },
    expiration: new Date(params.expiration! * 1000)
      .toISOString()
      .replace('.000Z', 'Z'),
  },
})

const message = MsgGrant.fromJSON(params)

describe('MsgGrant', () => {
  it('generates proper proto', () => {
    const proto = message.toProto()

    expect(proto).toEqual(
      expect.objectContaining({
        grantee: protoParams.grantee,
        granter: protoParams.granter,
        grant: expect.objectContaining({
          authorization: expect.objectContaining({
            typeUrl: '/cosmos.authz.v1beta1.GenericAuthorization',
            value: expect.any(Uint8Array),
          }),
          expiration: expect.objectContaining({
            nanos: 0,
            seconds: expect.any(BigInt),
          }),
        }),
      }),
    )
  })

  it('generates proper data', () => {
    const data = message.toData()

    expect(data).toEqual(
      expect.objectContaining({
        '@type': protoType,
        grantee: protoParams.grantee,
        granter: protoParams.granter,
        grant: expect.objectContaining({
          authorization: expect.objectContaining({
            typeUrl: '/cosmos.authz.v1beta1.GenericAuthorization',
            value: expect.any(Uint8Array),
          }),
          expiration: expect.objectContaining({
            nanos: 0,
            seconds: expect.any(BigInt),
          }),
        }),
      }),
    )
  })

  it('generates proper amino', () => {
    const amino = message.toAmino()

    expect(amino).toStrictEqual({
      type: protoTypeShort,
      value: protoParamsAmino,
    })
  })

  it('generates JSON without BigInt serialization error', () => {
    expect(() => message.toJSON()).not.toThrow()

    const json = message.toJSON()
    const parsed = JSON.parse(json)

    expect(typeof parsed.grant.expiration.seconds).toBe('string')
    expect(parsed.grant.expiration.seconds).toBe(params.expiration!.toString())
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
