import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import { MsgTransfer as BaseMsgTransfer } from '@injectivelabs/chain-api/ibc/applications/transfer/v1/tx_pb'
import { Height } from '@injectivelabs/chain-api/ibc/core/client/v1/client_pb'
import { MsgBase } from '../../MsgBase'

export declare namespace MsgTransfer {
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

  export interface DirectSign {
    type: '/ibc.applications.transfer.v1.MsgTransfer'
    message: BaseMsgTransfer
  }

  export interface Data extends BaseMsgTransfer.AsObject {
    '@type': '/ibc.applications.transfer.v1.MsgTransfer'
  }

  export interface Amino extends BaseMsgTransfer.AsObject {
    type: 'cosmos-sdk/MsgTransfer'
  }

  export interface Web3 extends BaseMsgTransfer.AsObject {
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

    const token = new Coin()
    token.setDenom(params.amount.denom)
    token.setAmount(params.amount.amount)

    const message = new BaseMsgTransfer()
    message.setReceiver(params.receiver)
    message.setSender(params.sender)
    message.setSourceChannel(params.channelId)
    message.setSourcePort(params.port)
    message.setToken(token)

    if (params.height) {
      const timeoutHeight = new Height()
      timeoutHeight.setRevisionHeight(params.height.revisionHeight)
      timeoutHeight.setRevisionNumber(params.height.revisionNumber)

      message.setTimeoutHeight(timeoutHeight)
    }

    if (params.timeout) {
      message.setTimeoutTimestamp(params.timeout)
    }

    return message
  }

  public toData(): MsgTransfer.Data {
    const proto = this.toProto()

    return {
      '@type': '/ibc.applications.transfer.v1.MsgTransfer',
      ...proto.toObject(),
    }
  }

  public toAmino(): MsgTransfer.Amino {
    const proto = this.toProto()

    return {
      type: 'cosmos-sdk/MsgTransfer',
      ...proto.toObject(),
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
}
