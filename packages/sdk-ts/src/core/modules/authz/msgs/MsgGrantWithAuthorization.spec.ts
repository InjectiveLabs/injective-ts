import MsgGrantWithAuthorization from './MsgGrantWithAuthorization.js'
import GenericAuthorization from './authorizations/GenericAuthorization.js'
import ContractExecutionAuthorization from './authorizations/ContractExecutionAuthorization.js'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import {
  getEip712TypedData,
  getEip712TypedDataV2,
} from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'
import { EIP712Version } from '@injectivelabs/ts-types'

const { injectiveAddress, injectiveAddress2 } = mockFactory

describe('MsgGrantWithAuthorization', () => {
  describe('GenericAuthorization', () => {
    const params: MsgGrantWithAuthorization['params'] = {
      grantee: injectiveAddress,
      granter: injectiveAddress2,
      authorization: GenericAuthorization.fromJSON({
        messageTypeUrl: '/cosmos.bank.v1beta1.MsgSend',
      }),
      expiration: 1800000000,
    }

    const any = params.authorization.toAny()
    const protoType = '/cosmos.authz.v1beta1.MsgGrant'
    const protoTypeShort = 'cosmos-sdk/MsgGrant'
    const protoParamsGenericAuthorization = {
      grantee: params.grantee,
      granter: params.granter,
      grant: {
        authorization: {
          typeUrl: any.typeUrl,
          value: new Uint8Array(Buffer.from(any.value)),
        },
        expiration: new Date(params.expiration! * 1000),
      },
    }

    const protoParamsGenericAuthorizationAmino = {
      grantee: params.grantee,
      granter: params.granter,
      grant: {
        authorization: params.authorization.toAmino(),
        expiration: new Date(params.expiration! * 1000)
          .toISOString()
          .replace('.000Z', 'Z'),
      },
    }
    const message = MsgGrantWithAuthorization.fromJSON(params)

    it('generates proper proto', () => {
      const proto = message.toProto()

      expect(proto).toStrictEqual({
        ...protoParamsGenericAuthorization,
      })
    })

    it('generates proper data', () => {
      const data = message.toData()

      expect(data).toStrictEqual({
        '@type': protoType,
        ...protoParamsGenericAuthorization,
      })
    })

    it('generates proper amino', () => {
      const amino = message.toAmino()

      expect(amino).toStrictEqual({
        type: protoTypeShort,
        value: protoParamsGenericAuthorizationAmino,
      })
    })

    describe('generates proper EIP712 compared to the Web3Gw (chain)', () => {
      const { endpoints, eip712Args, prepareEip712Request } = prepareEip712({
        messages: message,
      })

      test('EIP712 v1', async () => {
        const eip712TypedData = getEip712TypedData(eip712Args)

        const txResponse = await new IndexerGrpcWeb3GwApi(
          endpoints.indexer,
        ).prepareEip712Request({
          ...prepareEip712Request,
          eip712Version: EIP712Version.V1,
        })

        expect(eip712TypedData).toStrictEqual(JSON.parse(txResponse.data))
      })

      test('EIP712 v2', async () => {
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

  describe('ContractExecutionAuthorization', () => {
    const params: MsgGrantWithAuthorization['params'] = {
      grantee: injectiveAddress,
      granter: injectiveAddress2,
      authorization: ContractExecutionAuthorization.fromJSON({
        contract: injectiveAddress,
        limit: {
          maxCalls: 100,
        },
        filter: {
          acceptedMessagesKeys: ['set_routes'],
        },
      }),
      expiration: 1800000000,
    }

    const any = params.authorization.toAny()
    const protoType = '/cosmos.authz.v1beta1.MsgGrant'
    const protoTypeShort = 'cosmos-sdk/MsgGrant'
    const protoParamsContractExecutionAuthorization = {
      grantee: params.grantee,
      granter: params.granter,
      grant: {
        authorization: {
          typeUrl: any.typeUrl,
          value: new Uint8Array(Buffer.from(any.value)),
        },
        expiration: new Date(params.expiration! * 1000),
      },
    }

    const protoParamsContractExecutionAuthorizationAmino = {
      grantee: params.grantee,
      granter: params.granter,
      grant: {
        authorization: params.authorization.toAmino(),
        expiration: new Date(params.expiration! * 1000)
          .toISOString()
          .replace('.000Z', 'Z'),
      },
    }
    const message = MsgGrantWithAuthorization.fromJSON(params)

    it('generates proper proto', () => {
      const proto = message.toProto()

      expect(proto).toStrictEqual({
        ...protoParamsContractExecutionAuthorization,
      })
    })

    it('generates proper data', () => {
      const data = message.toData()

      expect(data).toStrictEqual({
        '@type': protoType,
        ...protoParamsContractExecutionAuthorization,
      })
    })

    it('generates proper amino', () => {
      const amino = message.toAmino()

      expect(amino).toStrictEqual({
        type: protoTypeShort,
        value: protoParamsContractExecutionAuthorizationAmino,
      })
    })

    describe('generates proper EIP712 compared to the Web3Gw (chain)', () => {
      const { endpoints, eip712Args, prepareEip712Request } = prepareEip712({
        messages: message,
      })

      // TODO: Fix this
      test.skip('EIP712 v1', async () => {
        const eip712TypedData = getEip712TypedData(eip712Args)

        const txResponse = await new IndexerGrpcWeb3GwApi(
          endpoints.indexer,
        ).prepareEip712Request({
          ...prepareEip712Request,
          eip712Version: EIP712Version.V1,
        })

        expect(eip712TypedData).toStrictEqual(JSON.parse(txResponse.data))
      })

      test('EIP712 v2', async () => {
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
})
