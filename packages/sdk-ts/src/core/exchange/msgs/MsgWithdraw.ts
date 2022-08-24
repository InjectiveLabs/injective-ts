import { MsgWithdraw as BaseMsgWithdraw } from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import { MsgBase } from '../../MsgBase'

export declare namespace MsgWithdraw {
  export interface Params {
    subaccountId: string
    injectiveAddress: string
    amount: {
      amount: string
      denom: string
    }
  }

  export interface DirectSign {
    type: '/injective.exchange.v1beta1.MsgWithdraw'
    message: BaseMsgWithdraw
  }

  export interface Data extends BaseMsgWithdraw.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgWithdraw'
  }

  export interface Amino extends BaseMsgWithdraw.AsObject {
    type: 'exchange/MsgWithdraw'
  }

  export interface Web3 extends BaseMsgWithdraw.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgWithdraw'
  }

  export type Proto = BaseMsgWithdraw
}

/**
 * @category Messages
 */
export default class MsgWithdraw extends MsgBase<
  MsgWithdraw.Params,
  MsgWithdraw.Data,
  MsgWithdraw.Proto,
  MsgWithdraw.Amino,
  MsgWithdraw.DirectSign
> {
  static fromJSON(params: MsgWithdraw.Params): MsgWithdraw {
    return new MsgWithdraw(params)
  }

  public toProto(): MsgWithdraw.Proto {
    const { params } = this

    const amountCoin = new Coin()
    amountCoin.setAmount(params.amount.amount)
    amountCoin.setDenom(params.amount.denom)

    const message = new BaseMsgWithdraw()
    message.setSender(params.injectiveAddress)
    message.setSubaccountId(params.subaccountId)
    message.setAmount(amountCoin)

    return message
  }

  public toData(): MsgWithdraw.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgWithdraw',
      ...proto.toObject(),
    }
  }

  public toAmino(): MsgWithdraw.Amino {
    const proto = this.toProto()

    return {
      type: 'exchange/MsgWithdraw',
      ...proto.toObject(),
    }
  }

  public toWeb3(): MsgWithdraw.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgWithdraw',
      ...rest,
    } as unknown as MsgWithdraw.Web3
  }

  public toDirectSign(): MsgWithdraw.DirectSign {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgWithdraw',
      message: proto,
    }
  }
}
