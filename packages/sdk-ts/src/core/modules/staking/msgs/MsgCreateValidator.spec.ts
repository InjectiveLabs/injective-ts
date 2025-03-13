import MsgCreateValidator from './MsgCreateValidator.js'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import { getEip712TypedDataV2 } from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'
import { EIP712Version } from '@injectivelabs/ts-types'

const params: MsgCreateValidator['params'] = {
  description: {
    moniker: 'Validator',
    identity: 'Validator',
    website: 'https://hub.injective.network',
    securityContact: 'example@email.com',
    details: 'Validator Details',
  },
  value: {
    amount: '1000000000000000000',
    denom: 'inj',
  },
  pubKey: {
    type: '/cosmos.crypto.ed25519.PubKey',
    value:
      'MHgwMjAyMDIwMjAyMDIwMjAyMDIwMjAyMDIwMjAyMDIwMjAyMDIwMjAyMDIwMjAyMDIwMjAyMDIwMjAyMDIwMjAy',
  },
  delegatorAddress: mockFactory.injectiveAddress,
  validatorAddress: mockFactory.validatorAddress,
  commission: {
    maxChangeRate: '10000000000000000',
    rate: '10000000000000000',
    maxRate: '10000000000000000',
  },
  minSelfDelegation: '10000000000000000',
}

const message = MsgCreateValidator.fromJSON(params)

describe('MsgCreateValidator', () => {
  describe('generates proper EIP712 compared to the Web3Gw (chain)', () => {
    const { endpoints, eip712Args, prepareEip712Request } = prepareEip712({
      messages: message,
    })

    it('EIP712 v1', async () => {
      expect(() => message.toEip712()).toThrow(
        'EIP712_v1 is not supported for MsgCreateValidator. Please use EIP712_v2',
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
