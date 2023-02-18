import { MsgDeposit as BaseMsgDeposit } from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/tx'
import { Coin } from '@injectivelabs/core-proto-ts/cosmos/base/v1beta1/coin'
import { MsgBase } from '../../MsgBase'
import snakecaseKeys from 'snakecase-keys'

export declare namespace MsgDeposit {
  export interface Params {
    subaccountId: string
    injectiveAddress: string
    amount: {
      amount: string
      denom: string
    }
  }

  export type Proto = BaseMsgDeposit
}

/**
 * @category Messages
 */
export default class MsgDeposit extends MsgBase<
  MsgDeposit.Params,
  MsgDeposit.Proto
> {
  static fromJSON(params: MsgDeposit.Params): MsgDeposit {
    return new MsgDeposit(params)
  }

  public toProto() {
    const { params } = this

    const amountCoin = Coin.create()
    amountCoin.amount = params.amount.amount
    amountCoin.denom = params.amount.denom

    const message = BaseMsgDeposit.create()
    message.sender = params.injectiveAddress
    message.subaccountId = params.subaccountId
    message.amount = amountCoin

    return BaseMsgDeposit.fromPartial(message)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgDeposit',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto),
    }

    return {
      type: 'exchange/MsgDeposit',
      value: message,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgDeposit',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgDeposit',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return BaseMsgDeposit.encode(this.toProto()).finish()
  }
}
