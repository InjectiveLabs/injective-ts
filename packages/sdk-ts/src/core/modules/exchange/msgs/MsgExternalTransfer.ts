import { MsgExternalTransfer as BaseMsgExternalTransfer } from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
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

  export type Object = BaseMsgExternalTransfer.AsObject
}

/**
 * @category Messages
 */
export default class MsgExternalTransfer extends MsgBase<
  MsgExternalTransfer.Params,
  MsgExternalTransfer.Proto,
  MsgExternalTransfer.Object
> {
  static fromJSON(params: MsgExternalTransfer.Params): MsgExternalTransfer {
    return new MsgExternalTransfer(params)
  }

  public toProto() {
    const { params } = this

    const amountCoin = new Coin()
    amountCoin.setAmount(params.amount.amount)
    amountCoin.setDenom(params.amount.denom)

    const message = new BaseMsgExternalTransfer()
    message.setSender(params.injectiveAddress)
    message.setSourceSubaccountId(params.srcSubaccountId)
    message.setDestinationSubaccountId(params.dstSubaccountId)
    message.setAmount(amountCoin)

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgExternalTransfer',
      ...proto.toObject(),
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto.toObject()),
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
}
