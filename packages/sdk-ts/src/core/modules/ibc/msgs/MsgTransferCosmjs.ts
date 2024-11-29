import { MsgTransfer as BaseMsgTransferCosmjs } from 'cosmjs-types/ibc/applications/transfer/v1/tx.js'
import {
  CosmosBaseV1Beta1Coin,
  IbcCoreClientV1Client,
  IbcApplicationsTransferV1Tx,
} from '@injectivelabs/core-proto-ts'

export declare namespace MsgTransferCosmjs {
  export interface Params {
    amount: {
      denom: string
      amount: string
    }
    sender: string
    port: string
    receiver: string
    channelId: string
    timeout?: number
    height?: {
      revisionHeight: number
      revisionNumber: number
    }
  }

  export type Proto = BaseMsgTransferCosmjs
}

/**
 * @category Messages
 *
 * @deprecated use MsgTransfer with SIGN_DIRECT and a Cosmos wallet
 */
export default class MsgTransferCosmjs {
  params: MsgTransferCosmjs.Params

  constructor(params: MsgTransferCosmjs.Params) {
    this.params = params
  }

  static fromJSON(params: MsgTransferCosmjs.Params): MsgTransferCosmjs {
    return new MsgTransferCosmjs(params)
  }

  public toProto() {
    const { params } = this

    const token = CosmosBaseV1Beta1Coin.Coin.create()
    token.denom = params.amount.denom
    token.amount = params.amount.amount

    const message = IbcApplicationsTransferV1Tx.MsgTransfer.create()

    message.sourcePort = params.port
    message.sourceChannel = params.channelId
    message.token = token
    message.sender = params.sender
    message.receiver = params.receiver

    if (params.height) {
      const timeoutHeight = IbcCoreClientV1Client.Height.create()
      timeoutHeight.revisionHeight = params.height.revisionHeight.toString()
      timeoutHeight.revisionNumber = params.height.revisionNumber.toString()

      message.timeoutHeight = timeoutHeight
    }

    if (params.timeout) {
      message.timeoutTimestamp = params.timeout.toString()
    }

    return BaseMsgTransferCosmjs.fromJSON(message)
  }

  public toData() {
    throw new Error('Method not implemented.')
  }

  public toAmino() {
    const { params } = this

    const message = BaseMsgTransferCosmjs.fromPartial({
      sourcePort: params.port,
      sourceChannel: params.channelId,
      sender: params.sender,
      receiver: params.receiver,
      token: params.amount,
      timeoutHeight: params.height
        ? {
            revisionHeight: BigInt(params.height.revisionHeight),
            revisionNumber: BigInt(params.height.revisionNumber),
          }
        : undefined,
      timeoutTimestamp: params.timeout ? BigInt(params.timeout) : undefined,
    })

    return {
      type: '/ibc.applications.transfer.v1.MsgTransfer',
      value: {
        ...message,
      },
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/ibc.applications.transfer.v1.MsgTransfer',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/ibc.applications.transfer.v1.MsgTransfer',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return BaseMsgTransferCosmjs.encode(this.toProto()).finish()
  }
}
