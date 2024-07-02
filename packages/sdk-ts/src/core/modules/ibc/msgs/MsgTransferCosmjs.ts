// import { MsgTransferEncodeObject } from '@cosmjs/stargate'
import snakecaseKeys, { SnakeCaseKeys } from 'snakecase-keys'
import { MsgTransfer as BaseMsgTransferCosmjs } from 'cosmjs-types/ibc/applications/transfer/v1/tx'
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
    message.receiver = params.receiver
    message.sender = params.sender
    message.sourceChannel = params.channelId
    message.sourcePort = params.port
    message.token = token

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
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto),
    }

    return {
      type: 'cosmos-sdk/MsgTransfer',
      value: {
        ...message,
      } as unknown as SnakeCaseKeys<IbcApplicationsTransferV1Tx.MsgTransfer>,
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
