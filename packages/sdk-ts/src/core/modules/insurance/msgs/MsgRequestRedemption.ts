import * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb.mjs'
import * as InjectiveInsuranceV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/insurance/v1beta1/tx_pb.mjs'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgRequestRedemption {
  export interface Params {
    marketId: string
    amount: {
      denom: string
      amount: string
    }
    injectiveAddress: string
  }

  export type Proto = InjectiveInsuranceV1Beta1TxPb.MsgRequestRedemption
}

/**
 * @category Messages
 */
export default class MsgRequestRedemption extends MsgBase<
  MsgRequestRedemption.Params,
  MsgRequestRedemption.Proto
> {
  static fromJSON(params: MsgRequestRedemption.Params): MsgRequestRedemption {
    return new MsgRequestRedemption(params)
  }

  public toProto() {
    const { params } = this

    const amountCoin = CosmosBaseV1Beta1CoinPb.Coin.create({
      denom: params.amount.denom,
      amount: params.amount.amount,
    })

    const message = InjectiveInsuranceV1Beta1TxPb.MsgRequestRedemption.create({
      sender: params.injectiveAddress,
      marketId: params.marketId,
      amount: amountCoin,
    })

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.insurance.v1beta1.MsgRequestRedemption',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      sender: proto.sender,
      market_id: proto.marketId,
      amount: proto.amount,
    }

    return {
      type: 'insurance/MsgRequestRedemption',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.insurance.v1beta1.MsgRequestRedemption',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.insurance.v1beta1.MsgRequestRedemption',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveInsuranceV1Beta1TxPb.MsgRequestRedemption.toBinary(
      this.toProto(),
    )
  }
}
