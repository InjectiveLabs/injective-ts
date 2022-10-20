/*
import { MsgReclaimLockedFunds as BaseMsgReclaimLockedFunds } from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import MsgReclaimLockedFunds from './MsgReclaimLockedFunds'
import { mockFactory } from '@injectivelabs/test-utils'
import snakecaseKeys from 'snakecase-keys'

const params: MsgReclaimLockedFunds['params'] = {
  sender: mockFactory.injectiveAddress,
  lockedAccount: mockFactory.injectiveAddress2,
  lockedAccountPubKey: mockFactory.injectiveAddress,
  unlockAuthorizationSignature: mockFactory.injectiveAddress,
}

const protoType = '/injective.exchange.v1beta1.MsgReclaimLockedFunds'
const protoTypeAmino = 'exchange/MsgReclaimLockedFunds'
const protoParams = {
  sender: params.sender,
  lockedAccount: params.lockedAccount,
  lockedAccountPubKey: params.lockedAccountPubKey,
  unlockAuthorizationSignature: params.unlockAuthorizationSignature,
}

const message = MsgReclaimLockedFunds.fromJSON(params)

describe.only('MsgReclaimLockedFunds', () => {
  it('generates proper proto', () => {
    const proto = message.toProto()

    expect(proto instanceof BaseMsgReclaimLockedFunds).toBe(true)
    expect(proto.toObject()).toStrictEqual(protoParams)
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
      ...protoParams,
    })
  })

  it('generates proper Eip712 types', () => {
    const eip712Types = message.toEip712Types()

    expect(Object.fromEntries(eip712Types)).toStrictEqual({
      MsgValue: [
        { name: 'sender', type: 'string' },
        { name: 'locked_account', type: 'string' },
        { name: 'locked_account_pub_key', type: 'string' },
        { name: 'unlock_authorization_signature', type: 'string' },
      ],
    })
  })

  it('generates proper Eip712 values', () => {
    const eip712 = message.toEip712()

    expect(eip712).toStrictEqual({
      type: protoTypeAmino,
      value: snakecaseKeys(protoParams),
    })
  })

  it('generates proper web3', () => {
    const web3 = message.toWeb3()

    expect(web3).toStrictEqual({
      '@type': protoType,
      ...protoParams,
    })
  })
})
*/
