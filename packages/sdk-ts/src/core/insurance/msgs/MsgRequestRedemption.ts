import { MsgRequestRedemption as BaseMsgRequestRedemption } from '@injectivelabs/chain-api/injective/insurance/v1beta1/tx_pb'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
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

  export interface Data extends BaseMsgRequestRedemption.AsObject {
    '@type': '/injective.insurance.v1beta1.MsgRequestRedemption'
  }

  export interface Web3 extends BaseMsgRequestRedemption.AsObject {
    '@type': '/injective.insurance.v1beta1.MsgRequestRedemption'
  }

  export type Proto = BaseMsgRequestRedemption
}

export default class MsgRequestRedemption extends MsgBase<
  MsgRequestRedemption.Params,
  MsgRequestRedemption.Data,
  MsgRequestRedemption.Proto,
  MsgRequestRedemption.Web3,
  MsgRequestRedemption.DirectSign
> {
  static fromJSON(params: MsgRequestRedemption.Params): MsgRequestRedemption {
    return new MsgRequestRedemption(params)
  }

  toProto(): MsgRequestRedemption.Proto {
    const { params } = this

    const amountCoin = new Coin()
    amountCoin.setAmount(params.amount.amount)
    amountCoin.setDenom(params.amount.denom)

    const message = new BaseMsgRequestRedemption()
    message.setAmount(amountCoin)
    message.setMarketId(params.marketId)
    message.setSender(params.injectiveAddress)

    return message
  }

  toData(): MsgRequestRedemption.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.insurance.v1beta1.MsgRequestRedemption',
      ...proto.toObject(),
    }
  }

  toWeb3(): MsgRequestRedemption.Web3 {
    const proto = this.toProto()

    return {
      '@type': '/injective.insurance.v1beta1.MsgRequestRedemption',
      ...proto.toObject(),
    }
  }

  toDirectSign(): MsgRequestRedemption.DirectSign {
    const proto = this.toProto()

    return {
      type: '/injective.insurance.v1beta1.MsgRequestRedemption',
      message: proto,
    }
  }
}
