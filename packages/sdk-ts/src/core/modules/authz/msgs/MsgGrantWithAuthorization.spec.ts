import MsgGrantWithAuthorization from './MsgGrantWithAuthorization.js'
import { mockFactory } from '@injectivelabs/test-utils'
import GenericAuthorization from './authorizations/GenericAuthorization.js'
import ContractExecutionAuthorization from './authorizations/ContractExecutionAuthorization.js'

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
        expiration: new Date(params.expiration! * 1000),
      },
    }
    const protoParamsGenericAuthorizationWeb3 = {
      grantee: params.grantee,
      granter: params.granter,
      grant: {
        authorization: params.authorization.toWeb3(),
        expiration: new Date(params.expiration! * 1000),
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
        type: 'cosmos-sdk/MsgGrant',
        value: {
          granter: 'inj14au322k9munkmx5wrchz9q30juf5wjgz2cfqku',
          grantee: 'inj14au322k9munkmx5wrchz9q30juf5wjgz2cfqku',
          grant: {
            authorization: {
              type: 'cosmos-sdk/GenericAuthorization',
              value: { msg: '/cosmos.bank.v1beta1.MsgSend' },
            },
            expiration: '2027-01-15T08:00:00Z',
          },
        },
      })
    })

    it('generates proper web3', () => {
      const web3 = message.toWeb3()

      expect(web3).toStrictEqual({
        '@type': protoType,
        ...protoParamsGenericAuthorizationWeb3,
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
        expiration: new Date(params.expiration! * 1000),
      },
    }
    const protoParamsContractExecutionAuthorizationWeb3 = {
      grantee: params.grantee,
      granter: params.granter,
      grant: {
        authorization: params.authorization.toWeb3(),
        expiration: new Date(params.expiration! * 1000),
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

    it('generates proper Eip712 types', () => {
      const eip712Types = message.toEip712Types()

      expect(Object.fromEntries(eip712Types)).toStrictEqual({
        TypeGrant: [
          { name: 'authorization', type: 'TypeGrantAuthorization' },
          { name: 'expiration', type: 'string' },
        ],
        TypeGrantAuthorization: [
          { name: 'type', type: 'string' },
          { name: 'grants', type: 'TypeGrantAuthorizationGrants[]' },
        ],
        TypeGrantAuthorizationGrants: [
          { name: 'contract', type: 'string' },
          { name: 'limit', type: 'TypeGrantAuthorizationGrantsLimit' },
          { name: 'filter', type: 'TypeGrantAuthorizationGrantsFilter' },
        ],
        TypeGrantAuthorizationGrantsLimit: [
          { name: 'type', type: 'string' },
          { name: 'remaining', type: 'uint64' },
        ],
        TypeGrantAuthorizationGrantsFilter: [
          { name: 'type', type: 'string' },
          { name: 'keys', type: 'string[]' },
        ],
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
        type: 'cosmos-sdk/MsgGrant',
        value: {
          granter: 'inj14au322k9munkmx5wrchz9q30juf5wjgz2cfqku',
          grantee: 'inj14au322k9munkmx5wrchz9q30juf5wjgz2cfqku',
          grant: {
            authorization: {
              type: 'wasm/ContractExecutionAuthorization',
              grants: [
                {
                  contract: 'inj14au322k9munkmx5wrchz9q30juf5wjgz2cfqku',
                  limit: { type: 'wasm/MaxCallsLimit', remaining: 100 },
                  filter: {
                    type: 'wasm/AcceptedMessageKeysFilter',
                    keys: ['set_routes'],
                  },
                },
              ],
            },
            expiration: '2027-01-15T08:00:00Z',
          },
        },
      })
    })

    it('generates proper web3', () => {
      const web3 = message.toWeb3()

      expect(web3).toStrictEqual({
        '@type': protoType,
        ...protoParamsContractExecutionAuthorizationWeb3,
      })
    })
  })
})
