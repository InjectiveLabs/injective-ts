import * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb.mjs'
import * as InjectiveTokenFactoryV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/tokenfactory/v1beta1/tx_pb.mjs'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgMint {
  export interface Params {
    sender: string
    receiver?: string
    amount: {
      amount: string
      denom: string
    }
  }

  export type Proto = InjectiveTokenFactoryV1Beta1TxPb.MsgMint
}

/**
 * @category Messages
 */
export default class MsgMint extends MsgBase<MsgMint.Params, MsgMint.Proto> {
  static fromJSON(params: MsgMint.Params): MsgMint {
    return new MsgMint(params)
  }

  public toProto() {
    const { params } = this

    const coin = CosmosBaseV1Beta1CoinPb.Coin.create({
      denom: params.amount.denom,
      amount: params.amount.amount,
    })

    const message = InjectiveTokenFactoryV1Beta1TxPb.MsgMint.create({
      sender: params.sender,
      amount: coin,
      ...(params.receiver && { receiver: params.receiver }),
    })

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.tokenfactory.v1beta1.MsgMint',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      sender: proto.sender,
      amount: proto.amount,
      ...(proto.receiver && { receiver: proto.receiver }),
    }

    return {
      type: 'injective/tokenfactory/mint',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.tokenfactory.v1beta1.MsgMint',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.tokenfactory.v1beta1.MsgMint',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveTokenFactoryV1Beta1TxPb.MsgMint.toBinary(this.toProto())
  }
}
