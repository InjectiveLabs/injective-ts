import { MsgBid as BaseMsgBid } from '@injectivelabs/chain-api/injective/auction/v1beta1/tx_pb'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import { MsgBase } from '../../MsgBase'

export declare namespace MsgBid {
  export interface Params {
    round: number
    injectiveAddress: string
    amount: {
      amount: string
      denom: string
    }
  }

  export interface DirectSign {
    type: '/injective.auction.v1beta1.MsgBid'
    message: BaseMsgBid
  }

  export interface Data extends BaseMsgBid.AsObject {
    '@type': '/injective.auction.v1beta1.MsgBid'
  }

  export interface Amino extends BaseMsgBid.AsObject {
    '@type': '/injective.auction.v1beta1.MsgBid'
  }

  export type Proto = BaseMsgBid
}

export default class MsgBid extends MsgBase<
  MsgBid.Params,
  MsgBid.Data,
  MsgBid.Proto,
  MsgBid.Amino,
  MsgBid.DirectSign
> {
  static fromJSON(params: MsgBid.Params): MsgBid {
    return new MsgBid(params)
  }

  toProto(): MsgBid.Proto {
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

  toData(): MsgBid.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.auction.v1beta1.MsgBid',
      ...proto.toObject(),
    }
  }

  toAmino(): MsgBid.Amino {
    const proto = this.toProto()

    return {
      '@type': '/injective.auction.v1beta1.MsgBid',
      ...proto.toObject(),
    }
  }

  toDirectSign(): MsgBid.DirectSign {
    const proto = this.toProto()

    return {
      type: '/injective.auction.v1beta1.MsgBid',
      message: proto,
    }
  }
}
