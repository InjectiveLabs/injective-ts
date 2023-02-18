import { MsgExternalTransfer as BaseMsgExternalTransfer } from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/tx'
import { Coin } from '@injectivelabs/core-proto-ts/cosmos/base/v1beta1/coin'
import { MsgBase } from '../../MsgBase'
import snakecaseKeys from 'snakecase-keys'

export declare namespace MsgExternalTransfer {
  export interface Params {
    srcSubaccountId: string
    dstSubaccountId: string
    injectiveAddress: string
    amount: {
      amount: string
      denom: string
    }
  }

  export type Proto = BaseMsgExternalTransfer
}

/**
 * @category Messages
 */
export default class MsgExternalTransfer extends MsgBase<
  MsgExternalTransfer.Params,
  MsgExternalTransfer.Proto
> {
  static fromJSON(params: MsgExternalTransfer.Params): MsgExternalTransfer {
    return new MsgExternalTransfer(params)
  }

  public toProto() {
    const { params } = this

    const amountCoin = Coin.create()
    amountCoin.amount = params.amount.amount
    amountCoin.denom = params.amount.denom

    const message = BaseMsgExternalTransfer.create()
    message.sender = params.injectiveAddress
    message.sourceSubaccountId = params.srcSubaccountId
    message.destinationSubaccountId = params.dstSubaccountId
    message.amount = amountCoin

    return BaseMsgExternalTransfer.fromPartial(message)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgExternalTransfer',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto),
    }

    return {
      type: 'exchange/MsgExternalTransfer',
      value: message,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgExternalTransfer',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgExternalTransfer',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return BaseMsgExternalTransfer.encode(this.toProto()).finish()
  }
}
