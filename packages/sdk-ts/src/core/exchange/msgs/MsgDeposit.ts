import { MsgDeposit as BaseMsgDeposit } from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import { MsgBase } from '../../MsgBase'

export declare namespace MsgDeposit {
  export interface Params {
    subaccountId: string
    injectiveAddress: string
    amount: {
      amount: string
      denom: string
    }
  }

  export interface Amino {
    type: '/injective.exchange.v1beta1.MsgDeposit'
    message: BaseMsgDeposit
  }

  export interface Data extends BaseMsgDeposit.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgDeposit'
  }

  export interface Web3 extends BaseMsgDeposit.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgDeposit'
  }

  export type Proto = BaseMsgDeposit
}

export default class MsgDeposit extends MsgBase<
  MsgDeposit.Params,
  MsgDeposit.Data,
  MsgDeposit.Proto,
  MsgDeposit.Web3,
  MsgDeposit.Amino
> {
  static fromJSON(params: MsgDeposit.Params): MsgDeposit {
    return new MsgDeposit(params)
  }

  toProto(): MsgDeposit.Proto {
    const { params } = this

    const amountCoin = new Coin()
    amountCoin.setAmount(params.amount.amount)
    amountCoin.setDenom(params.amount.denom)

    const message = new BaseMsgDeposit()
    message.setSender(params.injectiveAddress)
    message.setSubaccountId(params.subaccountId)
    message.setAmount(amountCoin)

    return message
  }

  toData(): MsgDeposit.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgDeposit',
      ...proto.toObject(),
    }
  }

  toWeb3(): MsgDeposit.Web3 {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgDeposit',
      ...proto.toObject(),
    }
  }

  toAmino(): MsgDeposit.Amino {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgDeposit',
      message: proto,
    }
  }
}
