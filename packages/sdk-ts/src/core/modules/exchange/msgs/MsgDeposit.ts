import { MsgDeposit as BaseMsgDeposit } from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/tx'
import { Coin } from '@injectivelabs/core-proto-ts/cosmos/base/v1beta1/coin'
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

  export interface DirectSign {
    type: '/injective.exchange.v1beta1.MsgDeposit'
    message: BaseMsgDeposit
  }

  export interface Data extends BaseMsgDeposit {
    '@type': '/injective.exchange.v1beta1.MsgDeposit'
  }

  export interface Amino extends BaseMsgDeposit {
    type: 'exchange/MsgDeposit'
  }

  export interface Web3 extends BaseMsgDeposit {
    '@type': '/injective.exchange.v1beta1.MsgDeposit'
  }

  export type Proto = BaseMsgDeposit
}

/**
 * @category Messages
 */
export default class MsgDeposit extends MsgBase<
  MsgDeposit.Params,
  MsgDeposit.Data,
  MsgDeposit.Proto,
  MsgDeposit.Amino,
  MsgDeposit.DirectSign
> {
  static fromJSON(params: MsgDeposit.Params): MsgDeposit {
    return new MsgDeposit(params)
  }

  public toProto(): MsgDeposit.Proto {
    const { params } = this

    const amountCoin = Coin.create()
    amountCoin.amount = params.amount.amount
    amountCoin.denom = params.amount.denom

    const message = BaseMsgDeposit.create()
    message.sender = params.injectiveAddress
    message.subaccountId = params.subaccountId
    message.amount = amountCoin

    return BaseMsgDeposit.fromPartial(message)
  }

  public toData(): MsgDeposit.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgDeposit',
      ...proto,
    }
  }

  public toAmino(): MsgDeposit.Amino {
    const proto = this.toProto()

    return {
      type: 'exchange/MsgDeposit',
      ...proto,
    }
  }

  public toWeb3(): MsgDeposit.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgDeposit',
      ...rest,
    } as unknown as MsgDeposit.Web3
  }

  public toDirectSign(): MsgDeposit.DirectSign {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgDeposit',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return BaseMsgDeposit.encode(this.toProto()).finish()
  }
}
