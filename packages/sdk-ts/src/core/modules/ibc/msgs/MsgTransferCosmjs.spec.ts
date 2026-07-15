import { mockFactory } from '@injectivelabs/utils/test-utils'
import MsgTransferCosmjs from './MsgTransferCosmjs.js'

const params: MsgTransferCosmjs['params'] = {
  amount: {
    denom: 'inj',
    amount: '1000000000000000000',
  },
  sender: mockFactory.injectiveAddress,
  port: 'transfer',
  receiver: mockFactory.injectiveAddress2,
  channelId: 'channel-0',
  timeout: 1000000000000000000,
  height: {
    revisionHeight: 1,
    revisionNumber: 1,
  },
}

const protoType = '/ibc.applications.transfer.v1.MsgTransfer'
const protoTypeShort = '/ibc.applications.transfer.v1.MsgTransfer'

const message = MsgTransferCosmjs.fromJSON(params)

describe('MsgTransferCosmjs', () => {
  it('generates proper proto', () => {
    const proto = message.toProto()

    expect(proto).toBeDefined()
    expect(proto.sourcePort).toBe(params.port)
    expect(proto.sourceChannel).toBe(params.channelId)
    expect(proto.sender).toBe(params.sender)
    expect(proto.receiver).toBe(params.receiver)
    expect(proto.token).toEqual(params.amount)
    expect(proto.timeoutHeight?.revisionHeight).toBe(
      BigInt(params.height!.revisionHeight),
    )
    expect(proto.timeoutHeight?.revisionNumber).toBe(
      BigInt(params.height!.revisionNumber),
    )
    expect(proto.timeoutTimestamp).toBe(BigInt(params.timeout!))
  })

  it('generates proper amino', () => {
    const amino = message.toAmino()

    expect(amino).toStrictEqual({
      type: protoTypeShort,
      value: {
        sourcePort: params.port,
        sourceChannel: params.channelId,
        sender: params.sender,
        receiver: params.receiver,
        token: params.amount,
        timeoutHeight: {
          revisionHeight: params.height!.revisionHeight.toString(),
          revisionNumber: params.height!.revisionNumber.toString(),
        },
        timeoutTimestamp: params.timeout!.toString(),
        memo: '',
        encoding: '',
      },
    })
  })

  it('generates proper web3Gw', () => {
    const web3 = message.toWeb3Gw()

    expect(web3).toStrictEqual({
      '@type': protoType,
      sourcePort: params.port,
      sourceChannel: params.channelId,
      sender: params.sender,
      receiver: params.receiver,
      token: params.amount,
      timeoutHeight: {
        revisionHeight: params.height!.revisionHeight.toString(),
        revisionNumber: params.height!.revisionNumber.toString(),
      },
      timeoutTimestamp: params.timeout!.toString(),
      memo: '',
      encoding: '',
    })
  })

  it('generates proper direct sign', () => {
    const directSign = message.toDirectSign()

    expect(directSign).toStrictEqual({
      type: protoType,
      message: message.toProto(),
    })
  })

  it('throws error for toData', () => {
    expect(() => message.toData()).toThrow('Method not implemented.')
  })
})
