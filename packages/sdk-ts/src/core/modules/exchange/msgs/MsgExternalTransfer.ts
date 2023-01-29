import { MsgExternalTransfer as BaseMsgExternalTransfer } from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/tx'
import { Coin } from '@injectivelabs/core-proto-ts/cosmos/base/v1beta1/coin'
import { MsgBase } from '../../MsgBase'

export declare namespace MsgExternalTransfer {
  export interface Params {
    srcSubaccountId: string
    dstSubaccountId: string
    injectiveAddress: string
    amount: {
      amount: string
      denom: string
    }
  }

  export interface DirectSign {
    type: '/injective.exchange.v1beta1.MsgExternalTransfer'
    message: BaseMsgExternalTransfer
  }

  export interface Data extends BaseMsgExternalTransfer {
    '@type': '/injective.exchange.v1beta1.MsgExternalTransfer'
  }

  export interface Amino extends BaseMsgExternalTransfer {
    type: 'exchange/MsgExternalTransfer'
  }

  export interface Web3 extends BaseMsgExternalTransfer {
    '@type': '/injective.exchange.v1beta1.MsgExternalTransfer'
  }

  export type Proto = BaseMsgExternalTransfer
}

/**
 * @category Messages
 */
export default class MsgExternalTransfer extends MsgBase<
  MsgExternalTransfer.Params,
  MsgExternalTransfer.Data,
  MsgExternalTransfer.Proto,
  MsgExternalTransfer.Amino,
  MsgExternalTransfer.DirectSign
> {
  static fromJSON(params: MsgExternalTransfer.Params): MsgExternalTransfer {
    return new MsgExternalTransfer(params)
  }

  public toProto(): MsgExternalTransfer.Proto {
    const { params } = this

    const amountCoin = Coin.create()
    amountCoin.amount = params.amount.amount
    amountCoin.denom = params.amount.denom

    const message = BaseMsgExternalTransfer.create()
    message.sender = params.injectiveAddress
    message.sourceSubaccountId = params.srcSubaccountId
    message.destinationSubaccountId = params.dstSubaccountId
    message.amount = amountCoin

    return BaseMsgExternalTransfer.fromPartial(message)
  }

  public toData(): MsgExternalTransfer.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgExternalTransfer',
      ...proto,
    }
  }

  public toAmino(): MsgExternalTransfer.Amino {
    const proto = this.toProto()

    return {
      type: 'exchange/MsgExternalTransfer',
      ...proto,
    }
  }

  public toWeb3(): MsgExternalTransfer.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgExternalTransfer',
      ...rest,
    } as unknown as MsgExternalTransfer.Web3
  }

  public toDirectSign(): MsgExternalTransfer.DirectSign {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgExternalTransfer',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return BaseMsgExternalTransfer.encode(this.toProto()).finish()
  }
}
