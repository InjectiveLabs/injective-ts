import { Coin } from '@injectivelabs/core-proto-ts/cosmos/base/v1beta1/coin'
import { MsgTransfer as BaseMsgTransfer } from '@injectivelabs/core-proto-ts/ibc/applications/transfer/v1/tx'
import { Height } from '@injectivelabs/core-proto-ts/ibc/core/client/v1/client'
import { MsgBase } from '../../MsgBase'

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

  export interface DirectSign {
    type: '/ibc.applications.transfer.v1.MsgTransfer'
    message: BaseMsgTransfer
  }

  export interface Data extends BaseMsgTransfer {
    '@type': '/ibc.applications.transfer.v1.MsgTransfer'
  }

  export interface Amino extends BaseMsgTransfer {
    type: 'cosmos-sdk/MsgTransfer'
  }

  export interface Web3 extends BaseMsgTransfer {
    '@type': '/ibc.applications.transfer.v1.MsgTransfer'
  }

  export type Proto = BaseMsgTransfer
}

/**
 * @category Messages
 */
export default class MsgTransfer extends MsgBase<
  MsgTransfer.Params,
  MsgTransfer.Data,
  MsgTransfer.Proto,
  MsgTransfer.Amino,
  MsgTransfer.DirectSign
> {
  static fromJSON(params: MsgTransfer.Params): MsgTransfer {
    return new MsgTransfer(params)
  }

  public toProto(): MsgTransfer.Proto {
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

  public toData(): MsgTransfer.Data {
    const proto = this.toProto()

    return {
      '@type': '/ibc.applications.transfer.v1.MsgTransfer',
      ...proto,
    }
  }

  public toAmino(): MsgTransfer.Amino {
    const { params } = this
    const proto = this.toProto()

    return {
      type: 'cosmos-sdk/MsgTransfer',
      ...proto,
      memo: params.memo || '',
    }
  }

  public toWeb3(): MsgTransfer.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/ibc.applications.transfer.v1.MsgTransfer',
      ...rest,
    } as unknown as MsgTransfer.Web3
  }

  public toDirectSign(): MsgTransfer.DirectSign {
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
