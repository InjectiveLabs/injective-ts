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

  export interface DirectSign {
    type: '/injective.exchange.v1beta1.MsgDeposit'
    message: BaseMsgDeposit
  }

  export interface Data extends BaseMsgDeposit.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgDeposit'
  }

  export interface Amino extends BaseMsgDeposit.AsObject {
    type: 'exchange/MsgDeposit'
  }

  export interface Web3 extends BaseMsgDeposit.AsObject {
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

    const amountCoin = new Coin()
    amountCoin.setAmount(params.amount.amount)
    amountCoin.setDenom(params.amount.denom)

    const message = new BaseMsgDeposit()
    message.setSender(params.injectiveAddress)
    message.setSubaccountId(params.subaccountId)
    message.setAmount(amountCoin)

    return message
  }

  public toData(): MsgDeposit.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgDeposit',
      ...proto.toObject(),
    }
  }

  public toAmino(): MsgDeposit.Amino {
    const proto = this.toProto()

    return {
      type: 'exchange/MsgDeposit',
      ...proto.toObject(),
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
}
