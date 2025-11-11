import * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb.mjs'
import * as InjectiveAuctionV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/auction/v1beta1/tx_pb.mjs'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgBid {
  export interface Params {
    round: number
    injectiveAddress: string
    amount: {
      denom: string
      amount: string
    }
  }

  export type Proto = InjectiveAuctionV1Beta1TxPb.MsgBid
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

    const amountCoin = CosmosBaseV1Beta1CoinPb.Coin.create({
      denom: params.amount.denom,
      amount: params.amount.amount,
    })

    const message = InjectiveAuctionV1Beta1TxPb.MsgBid.create({
      sender: params.injectiveAddress,
      bidAmount: amountCoin,
      round: BigInt(params.round),
    })

    return message
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
      sender: proto.sender,
      bid_amount: proto.bidAmount,
      round: proto.round.toString(),
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

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.auction.v1beta1.MsgBid',
      ...value,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveAuctionV1Beta1TxPb.MsgBid.toBinary(this.toProto())
  }
}
