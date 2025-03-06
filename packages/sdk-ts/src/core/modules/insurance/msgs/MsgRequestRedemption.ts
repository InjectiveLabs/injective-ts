import { MsgBase } from '../../MsgBase.js'
import snakecaseKeys from 'snakecase-keys'
import {
  CosmosBaseV1Beta1Coin,
  InjectiveInsuranceV1Beta1Tx,
} from '@injectivelabs/core-proto-ts'

export declare namespace MsgRequestRedemption {
  export interface Params {
    marketId: string
    amount: {
      denom: string
      amount: string
    }
    injectiveAddress: string
  }

  export type Proto = InjectiveInsuranceV1Beta1Tx.MsgRequestRedemption
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

    const amountCoin = CosmosBaseV1Beta1Coin.Coin.create()

    amountCoin.denom = params.amount.denom
    amountCoin.amount = params.amount.amount

    const message = InjectiveInsuranceV1Beta1Tx.MsgRequestRedemption.create()

    message.sender = params.injectiveAddress
    message.marketId = params.marketId
    message.amount = amountCoin

    return InjectiveInsuranceV1Beta1Tx.MsgRequestRedemption.fromJSON(message)
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
      ...snakecaseKeys(proto),
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
    return InjectiveInsuranceV1Beta1Tx.MsgRequestRedemption.encode(
      this.toProto(),
    ).finish()
  }
}
