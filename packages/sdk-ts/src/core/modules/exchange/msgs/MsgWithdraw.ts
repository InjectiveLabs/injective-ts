import { MsgWithdraw as BaseMsgWithdraw } from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/tx'
import { Coin } from '@injectivelabs/core-proto-ts/cosmos/base/v1beta1/coin'
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

  export interface Data extends BaseMsgWithdraw {
    '@type': '/injective.exchange.v1beta1.MsgWithdraw'
  }

  export interface Amino extends BaseMsgWithdraw {
    type: 'exchange/MsgWithdraw'
  }

  export interface Web3 extends BaseMsgWithdraw {
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

    const amountCoin = Coin.create()
    amountCoin.amount = params.amount.amount
    amountCoin.denom = params.amount.denom

    const message = BaseMsgWithdraw.create()
    message.sender = params.injectiveAddress
    message.subaccountId = params.subaccountId
    message.amount = amountCoin

    return BaseMsgWithdraw.fromPartial(message)
  }

  public toData(): MsgWithdraw.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgWithdraw',
      ...proto,
    }
  }

  public toAmino(): MsgWithdraw.Amino {
    const proto = this.toProto()

    return {
      type: 'exchange/MsgWithdraw',
      ...proto,
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

  public toBinary(): Uint8Array {
    return BaseMsgWithdraw.encode(this.toProto()).finish()
  }
}
