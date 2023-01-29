import { MsgBid as BaseMsgBid } from '@injectivelabs/core-proto-ts/injective/auction/v1beta1/tx'
import { Coin } from '@injectivelabs/core-proto-ts/cosmos/base/v1beta1/coin'
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

  export interface Data extends BaseMsgBid {
    '@type': '/injective.auction.v1beta1.MsgBid'
  }

  export interface Amino extends BaseMsgBid {
    type: 'auction/MsgBid'
  }

  export interface Web3 extends BaseMsgBid {
    '@type': '/injective.auction.v1beta1.MsgBid'
  }

  export type Proto = BaseMsgBid
}

/**
 * @category Messages
 */
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

  public toProto(): MsgBid.Proto {
    const { params } = this

    const amountCoin = Coin.create()
    amountCoin.amount = params.amount.amount
    amountCoin.denom = params.amount.denom

    const message = BaseMsgBid.create()
    message.sender = params.injectiveAddress
    message.round = params.round.toString()
    message.bidAmount = amountCoin

    return BaseMsgBid.fromPartial(message)
  }

  public toData(): MsgBid.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.auction.v1beta1.MsgBid',
      ...proto,
    }
  }

  public toAmino(): MsgBid.Amino {
    const proto = this.toProto()

    return {
      type: 'auction/MsgBid',
      ...proto,
    }
  }

  public toDirectSign(): MsgBid.DirectSign {
    const proto = this.toProto()

    return {
      type: '/injective.auction.v1beta1.MsgBid',
      message: proto,
    }
  }

  public toWeb3(): MsgBid.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/injective.auction.v1beta1.MsgBid',
      ...rest,
    }
  }

  public toBinary(): Uint8Array {
    return BaseMsgBid.encode(this.toProto()).finish()
  }
}
