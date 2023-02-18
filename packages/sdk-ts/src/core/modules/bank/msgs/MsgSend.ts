import { Coin } from '@injectivelabs/core-proto-ts/cosmos/base/v1beta1/coin'
import { MsgSend as BaseMsgSend } from '@injectivelabs/core-proto-ts/cosmos/bank/v1beta1/tx'
import snakecaseKeys from 'snakecase-keys'
import { MsgBase } from '../../MsgBase'

export declare namespace MsgSend {
  export interface Params {
    amount: {
      denom: string
      amount: string
    }
    srcInjectiveAddress: string
    dstInjectiveAddress: string
  }

  export type Proto = BaseMsgSend
}

/**
 * @category Messages
 */
export default class MsgSend extends MsgBase<MsgSend.Params, MsgSend.Proto> {
  static fromJSON(params: MsgSend.Params): MsgSend {
    return new MsgSend(params)
  }

  public toProto() {
    const { params } = this

    const amountToSend = Coin.create()
    amountToSend.amount = params.amount.amount
    amountToSend.denom = params.amount.denom

    const message = BaseMsgSend.create()
    message.fromAddress = params.srcInjectiveAddress
    message.toAddress = params.dstInjectiveAddress
    message.amount = [amountToSend]

    return BaseMsgSend.fromPartial(message)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.bank.v1beta1.MsgSend',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto),
    }

    return {
      type: 'cosmos-sdk/MsgSend',
      value: message,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/cosmos.bank.v1beta1.MsgSend',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/cosmos.bank.v1beta1.MsgSend',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return BaseMsgSend.encode(this.toProto()).finish()
  }
}
