import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import { MsgSend as BaseMsgSend } from '@injectivelabs/chain-api/cosmos/bank/v1beta1/tx_pb'
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

  export type Object = BaseMsgSend.AsObject
}

/**
 * @category Messages
 */
export default class MsgSend extends MsgBase<
  MsgSend.Params,
  MsgSend.Proto,
  MsgSend.Object
> {
  static fromJSON(params: MsgSend.Params): MsgSend {
    return new MsgSend(params)
  }

  public toProto() {
    const { params } = this

    const amountToSend = new Coin()
    amountToSend.setAmount(params.amount.amount)
    amountToSend.setDenom(params.amount.denom)

    const message = new BaseMsgSend()
    message.setFromAddress(params.srcInjectiveAddress)
    message.setToAddress(params.dstInjectiveAddress)
    message.setAmountList([amountToSend])

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.bank.v1beta1.MsgSend',
      ...proto.toObject(),
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto.toObject()),
      amount: proto
        .getAmountList()
        .map((amount) => snakecaseKeys(amount.toObject())),
    }

    // @ts-ignore
    delete message.amount_list

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
}
