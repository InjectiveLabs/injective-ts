import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import { MsgTransfer as BaseMsgTransfer } from '@injectivelabs/chain-api/ibc/applications/transfer/v1/tx_pb'
import { Height } from '@injectivelabs/chain-api/ibc/core/client/v1/client_pb'
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

    message.setMemo(params.memo || '')

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/ibc.applications.transfer.v1.MsgTransfer',
      ...proto.toObject(),
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto.toObject()),
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
}
