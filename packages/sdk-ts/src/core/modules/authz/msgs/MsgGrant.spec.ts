import MsgGrant from './MsgGrant.js'
import snakecaseKeys from 'snakecase-keys'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import { IndexerGrpcWeb3GwApi } from '../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'
import { getEip712TypedData, getEip712TypedDataV2 } from '../../../tx/index.js'

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
    expiration: new Date(params.expiration! * 1000),
  },
})

const message = MsgGrant.fromJSON(params)

describe('MsgGrant', () => {
  it('generates proper proto', () => {
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

  it('generates proper Eip712 types', () => {
    const eip712Types = message.toEip712Types()

    expect(Object.fromEntries(eip712Types)).toStrictEqual({
      TypeGrant: [
        { name: 'authorization', type: 'TypeGrantAuthorization' },
        { name: 'expiration', type: 'string' },
      ],
      TypeGrantAuthorization: [
        { name: 'type', type: 'string' },
        { name: 'value', type: 'TypeGrantAuthorizationValue' },
      ],
      TypeGrantAuthorizationValue: [{ name: 'msg', type: 'string' }],
      MsgValue: [
        { name: 'granter', type: 'string' },
        { name: 'grantee', type: 'string' },
        { name: 'grant', type: 'TypeGrant' },
      ],
    })
  })

  it('generates proper Eip712 values', () => {
    const eip712 = message.toEip712()

    expect(eip712).toStrictEqual({
      type: protoTypeShort,
      value: snakecaseKeys({
        ...protoParamsAmino,
        grant: {
          ...protoParamsAmino.grant,
          expiration:
            protoParamsAmino.grant.expiration.toJSON().split('.')[0] + 'Z',
        },
      }),
    })
  })

  describe('generates proper EIP712 compared to the Web3Gw (chain)', () => {
    const { endpoints, eip712Args, prepareEip712Request } = prepareEip712({
      sequence: 0,
      accountNumber: 3,
      messages: message,
    })

    it('EIP712 v1', async () => {
      const eip712TypedData = getEip712TypedData(eip712Args)

      const txResponse = await new IndexerGrpcWeb3GwApi(
        endpoints.indexer,
      ).prepareEip712Request({
        ...prepareEip712Request,
        eip712Version: 'v1',
      })

      expect(eip712TypedData).toStrictEqual(JSON.parse(txResponse.data))
    })

    it('EIP712 v2', async () => {
      const eip712TypedData = getEip712TypedDataV2(eip712Args)

      const txResponse = await new IndexerGrpcWeb3GwApi(
        endpoints.indexer,
      ).prepareEip712Request({ ...prepareEip712Request, eip712Version: 'v2' })

      expect(eip712TypedData).toStrictEqual(JSON.parse(txResponse.data))
    })
  })
})
