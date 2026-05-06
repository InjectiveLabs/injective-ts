import { mockFactory } from '@injectivelabs/utils/test-utils'
import MsgReclaimLockedFundsV2 from './MsgReclaimLockedFundsV2.js'

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
  })

  it('throws for EIP712', () => {
    expect(() => message.toWeb3Gw()).toThrow()
    expect(() => message.toEip712()).toThrow()
    expect(() => message.toEip712V2()).toThrow()
  })
})
