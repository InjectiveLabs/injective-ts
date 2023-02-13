import { MsgBid as BaseMsgBid } from '@injectivelabs/chain-api/injective/auction/v1beta1/tx_pb'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import { MsgBase } from '../../MsgBase'
import snakecaseKeys from 'snakecase-keys'

export declare namespace MsgBid {
  export interface Params {
    round: number
    injectiveAddress: string
    amount: {
      amount: string
      denom: string
    }
  }

  export type Proto = BaseMsgBid

  export type Object = BaseMsgBid.AsObject
}

/**
 * @category Messages
 */
export default class MsgBid extends MsgBase<
  MsgBid.Params,
  MsgBid.Proto,
  MsgBid.Object
> {
  static fromJSON(params: MsgBid.Params): MsgBid {
    return new MsgBid(params)
  }

  public toProto() {
    const { params } = this

    const amountCoin = new Coin()
    amountCoin.setAmount(params.amount.amount)
    amountCoin.setDenom(params.amount.denom)

    const message = new BaseMsgBid()
    message.setSender(params.injectiveAddress)
    message.setRound(params.round)
    message.setBidAmount(amountCoin)

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.auction.v1beta1.MsgBid',
      ...proto.toObject(),
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto.toObject()),
    }

    return {
      type: 'auction/MsgBid',
      value: message,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.auction.v1beta1.MsgBid',
      message: proto,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.auction.v1beta1.MsgBid',
      ...value,
    }
  }
}
