import { Coin } from '@injectivelabs/core-proto-ts/cosmos/base/v1beta1/coin'
import { MsgTransfer as BaseMsgTransfer } from '@injectivelabs/core-proto-ts/ibc/applications/transfer/v1/tx'
import { Height } from '@injectivelabs/core-proto-ts/ibc/core/client/v1/client'
import { MsgBase } from '../../MsgBase'
import snakecaseKeys, { SnakeCaseKeys } from 'snakecase-keys'

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

  export type Proto = BaseMsgTransfer

  export type Object = BaseMsgTransfer.AsObject
}

/**
 * @category Messages
 */
export default class MsgTransfer extends MsgBase<
  MsgTransfer.Params,
  MsgTransfer.Proto,
  MsgTransfer.Object
> {
  static fromJSON(params: MsgTransfer.Params): MsgTransfer {
    return new MsgTransfer(params)
  }

  public toProto() {
    const { params } = this

    const token = Coin.create()
    token.denom = params.amount.denom
    token.amount = params.amount.amount

    const message = BaseMsgTransfer.create()
    message.receiver = params.receiver
    message.sender = params.sender
    message.sourceChannel = params.channelId
    message.sourcePort = params.port
    message.token = token

    if (params.height) {
      const timeoutHeight = Height.create()
      timeoutHeight.revisionHeight = params.height.revisionHeight.toString()
      timeoutHeight.revisionNumber = params.height.revisionNumber.toString()

      message.timeoutHeight = timeoutHeight
    }

    if (params.timeout) {
      message.timeoutTimestamp = params.timeout.toString()
    }

    message.memo = params.memo || ''

    return BaseMsgTransfer.fromJSON(message)
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
      } as unknown as SnakeCaseKeys<MsgTransfer.Object>,
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
    return BaseMsgTransfer.encode(this.toProto()).finish()
  }
}
