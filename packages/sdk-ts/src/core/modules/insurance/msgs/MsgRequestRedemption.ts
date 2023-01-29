import { MsgRequestRedemption as BaseMsgRequestRedemption } from '@injectivelabs/core-proto-ts/injective/insurance/v1beta1/tx'
import { Coin } from '@injectivelabs/core-proto-ts/cosmos/base/v1beta1/coin'
import { MsgBase } from '../../MsgBase'

export declare namespace MsgRequestRedemption {
  export interface Params {
    marketId: string
    amount: {
      denom: string
      amount: string
    }
    injectiveAddress: string
  }

  export interface DirectSign {
    type: '/injective.insurance.v1beta1.MsgRequestRedemption'
    message: BaseMsgRequestRedemption
  }

  export interface Data extends BaseMsgRequestRedemption {
    '@type': '/injective.insurance.v1beta1.MsgRequestRedemption'
  }

  export interface Amino extends BaseMsgRequestRedemption {
    type: 'insurance/MsgRequestRedemption'
  }

  export interface Web3 extends BaseMsgRequestRedemption {
    '@type': '/injective.insurance.v1beta1.MsgRequestRedemption'
  }

  export type Proto = BaseMsgRequestRedemption
}

/**
 * @category Messages
 */
export default class MsgRequestRedemption extends MsgBase<
  MsgRequestRedemption.Params,
  MsgRequestRedemption.Data,
  MsgRequestRedemption.Proto,
  MsgRequestRedemption.Amino,
  MsgRequestRedemption.DirectSign
> {
  static fromJSON(params: MsgRequestRedemption.Params): MsgRequestRedemption {
    return new MsgRequestRedemption(params)
  }

  public toProto(): MsgRequestRedemption.Proto {
    const { params } = this

    const amountCoin = Coin.create()
    amountCoin.amount = params.amount.amount
    amountCoin.denom = params.amount.denom

    const message = BaseMsgRequestRedemption.create()
    message.amount = amountCoin
    message.marketId = params.marketId
    message.sender = params.injectiveAddress

    return BaseMsgRequestRedemption.fromJSON(message)
  }

  public toData(): MsgRequestRedemption.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.insurance.v1beta1.MsgRequestRedemption',
      ...proto,
    }
  }

  public toAmino(): MsgRequestRedemption.Amino {
    const proto = this.toProto()

    return {
      type: 'insurance/MsgRequestRedemption',
      ...proto,
    }
  }

  public toWeb3(): MsgRequestRedemption.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/injective.insurance.v1beta1.MsgRequestRedemption',
      ...rest,
    } as unknown as MsgRequestRedemption.Web3
  }

  public toDirectSign(): MsgRequestRedemption.DirectSign {
    const proto = this.toProto()

    return {
      type: '/injective.insurance.v1beta1.MsgRequestRedemption',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return BaseMsgRequestRedemption.encode(this.toProto()).finish()
  }
}
