import { MsgBase } from '../../MsgBase'
import snakecaseKeys from 'snakecase-keys'
import {
  CosmosBaseV1Beta1Coin,
  InjectiveAuctionV1Beta1Tx,
} from '@injectivelabs/core-proto-ts'

export declare namespace MsgBid {
  export interface Params {
    round: number
    injectiveAddress: string
    amount: {
      amount: string
      denom: string
    }
  }

  export type Proto = InjectiveAuctionV1Beta1Tx.MsgBid
}

/**
 * @category Messages
 */
export default class MsgBid extends MsgBase<MsgBid.Params, MsgBid.Proto> {
  static fromJSON(params: MsgBid.Params): MsgBid {
    return new MsgBid(params)
  }

  public toProto() {
    const { params } = this

    const amountCoin = CosmosBaseV1Beta1Coin.Coin.create()
    amountCoin.amount = params.amount.amount
    amountCoin.denom = params.amount.denom

    const message = InjectiveAuctionV1Beta1Tx.MsgBid.create()
    message.sender = params.injectiveAddress
    message.round = params.round.toString()
    message.bidAmount = amountCoin

    return InjectiveAuctionV1Beta1Tx.MsgBid.fromPartial(message)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.auction.v1beta1.MsgBid',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto),
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

  public toBinary(): Uint8Array {
    return InjectiveAuctionV1Beta1Tx.MsgBid.encode(this.toProto()).finish()
  }
}
