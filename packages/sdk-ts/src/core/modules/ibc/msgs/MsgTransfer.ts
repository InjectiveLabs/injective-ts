import { MsgBase } from '../../MsgBase'
import snakecaseKeys, { SnakeCaseKeys } from 'snakecase-keys'
import {
  CosmosBaseV1Beta1Coin,
  IbcCoreClientV1Client,
  IbcApplicationsTransferV1Tx,
} from '@injectivelabs/core-proto-ts'

export declare namespace MsgTransfer {
  export interface Params {
    amount: {
      denom: string
      amount: string
    }
    memo?: string
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

  export type Proto = IbcApplicationsTransferV1Tx.MsgTransfer
}

/**
 * @category Messages
 */
export default class MsgTransfer extends MsgBase<
  MsgTransfer.Params,
  MsgTransfer.Proto
> {
  static fromJSON(params: MsgTransfer.Params): MsgTransfer {
    return new MsgTransfer(params)
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

    message.memo = params.memo || ''

    return IbcApplicationsTransferV1Tx.MsgTransfer.fromJSON(message)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/ibc.applications.transfer.v1.MsgTransfer',
      ...proto,
    }
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
        memo: message.memo || '',
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
    return IbcApplicationsTransferV1Tx.MsgTransfer.encode(
      this.toProto(),
    ).finish()
  }
}
