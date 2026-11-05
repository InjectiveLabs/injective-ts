import { Network } from '@injectivelabs/networks'
import { EIP712Version } from '@injectivelabs/ts-types'
import { mockFactory } from '@injectivelabs/utils/test-utils'
import { prepareEip712 } from '@injectivelabs/utils/test-utils'
import MsgReclaimLockedFundsV2 from './MsgReclaimLockedFundsV2.js'
import {
  getEip712TypedData,
  getEip712TypedDataV2,
} from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'

const params: MsgReclaimLockedFundsV2['params'] = {
  sender: mockFactory.injectiveAddress,
  lockedAccountPubKey: 'dGVzdC1wdWJrZXk=',
  signature: new Uint8Array([1, 2, 3]),
}

const protoType = '/injective.exchange.v2.MsgReclaimLockedFunds'
const protoTypeShort = 'exchange/v2/MsgReclaimLockedFunds'
const message = MsgReclaimLockedFundsV2.fromJSON(params)

describe('MsgReclaimLockedFundsV2', () => {
  it('generates proper data', () => {
    const data = message.toData()

    expect(data['@type']).toStrictEqual(protoType)
    expect(data.sender).toStrictEqual(params.sender)
  })

  it('generates proper amino', () => {
    const amino = message.toAmino()

    expect(amino.type).toStrictEqual(protoTypeShort)
    expect(amino.value.sender).toStrictEqual(params.sender)
    expect(amino.value.lockedAccountPubKey).toStrictEqual(
      params.lockedAccountPubKey,
    )
  })

  it('generates proper web3Gw', () => {
    const web3 = message.toWeb3Gw()

    expect(web3).toStrictEqual({
      '@type': protoType,
      sender: params.sender,
      lockedAccountPubKey: params.lockedAccountPubKey,
      signature: 'AQID',
    })
  })

  it('keeps the chain amino values and schema for EIP712 v1', () => {
    expect(message.toEip712()).toStrictEqual(message.toAmino())
    expect(message.toEip712Types().get('MsgValue')).toStrictEqual([
      { name: 'sender', type: 'string' },
      { name: 'lockedAccountPubKey', type: 'uint8[]' },
      { name: 'signature', type: 'uint8[]' },
    ])
  })

  it('EIP712 v1 type equals the chain amino type', () => {
    expect(message.toEip712().type).toBe(message.toAmino().type)
  })

  describe('generates proper EIP712 payloads', () => {
    const { endpoints, eip712Args, prepareEip712Request } = prepareEip712({
      // TODO: switch to Network.Mainnet after the v1.21 mainnet upgrade
      network: Network.Testnet,
      messages: message,
    })

    // the chain declares the bytes as `uint8[]` but carries their base64 string, which its
    // typed-data encoder cannot hash, so there is nothing to sign with EIP712 v1
    it('EIP712 v1 rejects the base64 bytes the chain declares as arrays', () => {
      expect(() => getEip712TypedData(eip712Args)).toThrow(
        'EIP712_v1 cannot sign a non-array value for an array field (msgs[0].value.lockedAccountPubKey). Please use EIP712_v2',
      )
    })

    it('toAmino matches the chain amino-json from the gateway', async () => {
      const txResponse = await new IndexerGrpcWeb3GwApi(
        endpoints.indexer,
      ).prepareEip712Request({
        ...prepareEip712Request,
        eip712Version: EIP712Version.V1,
      })

      expect(message.toAmino()).toStrictEqual(
        JSON.parse(txResponse.data).message.msgs[0],
      )
    })

    it('EIP712 v2', () => {
      const eip712TypedData = getEip712TypedDataV2(eip712Args)

      expect(eip712TypedData.message.msgs).toStrictEqual(
        JSON.stringify([
          {
            '@type': protoType,
            sender: params.sender,
            lockedAccountPubKey: params.lockedAccountPubKey,
            signature: 'AQID',
          },
        ]),
      )
    })
  })
})
