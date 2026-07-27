import { mockFactory } from '@injectivelabs/utils/test-utils'
import { prepareEip712 } from '@injectivelabs/utils/test-utils'
import MsgReclaimLockedFundsV2 from './MsgReclaimLockedFundsV2.js'
import {
  getEip712TypedData,
  getEip712TypedDataV2,
} from '../../../tx/eip712/eip712.js'

const params: MsgReclaimLockedFundsV2['params'] = {
  sender: mockFactory.injectiveAddress,
  lockedAccountPubKey: 'dGVzdC1wdWJrZXk=',
  signature: new Uint8Array([1, 2, 3]),
}

const protoType = '/injective.exchange.v2.MsgReclaimLockedFunds'
const protoTypeShort = 'exchange/MsgReclaimLockedFunds'
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

  it('generates uint8 arrays for EIP712 v1', () => {
    expect(message.toEip712()).toStrictEqual({
      type: protoTypeShort,
      value: {
        sender: params.sender,
        lockedAccountPubKey: Array.from(
          new TextEncoder().encode('test-pubkey'),
        ),
        signature: [1, 2, 3],
      },
    })
    expect(message.toEip712Types().get('MsgValue')).toStrictEqual([
      { name: 'sender', type: 'string' },
      { name: 'lockedAccountPubKey', type: 'uint8[]' },
      { name: 'signature', type: 'uint8[]' },
    ])
  })

  describe('generates proper EIP712 payloads', () => {
    const { eip712Args } = prepareEip712({
      messages: message,
    })

    it('EIP712 v1', async () => {
      const eip712TypedData = getEip712TypedData(eip712Args)
      const expectedTypedData = {
        ...eip712TypedData,
        message: {
          ...eip712TypedData.message,
          msgs: [
            {
              type: protoTypeShort,
              value: {
                sender: params.sender,
                lockedAccountPubKey: Array.from(
                  message.toProto().lockedAccountPubKey,
                ),
                signature: Array.from(message.toProto().signature),
              },
            },
          ],
        },
      }

      expect(eip712TypedData).toStrictEqual(expectedTypedData)
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
