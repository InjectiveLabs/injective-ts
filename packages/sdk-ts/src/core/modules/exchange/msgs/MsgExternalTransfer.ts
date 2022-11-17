import { MsgExternalTransfer as BaseMsgExternalTransfer } from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
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

  export interface Data extends BaseMsgExternalTransfer.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgExternalTransfer'
  }

  export interface Amino extends BaseMsgExternalTransfer.AsObject {
    type: 'exchange/MsgExternalTransfer'
  }

  export interface Web3 extends BaseMsgExternalTransfer.AsObject {
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

    const amountCoin = new Coin()
    amountCoin.setAmount(params.amount.amount)
    amountCoin.setDenom(params.amount.denom)

    const message = new BaseMsgExternalTransfer()
    message.setSender(params.injectiveAddress)
    message.setSourceSubaccountId(params.srcSubaccountId)
    message.setDestinationSubaccountId(params.dstSubaccountId)
    message.setAmount(amountCoin)

    return message
  }

  public toData(): MsgExternalTransfer.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgExternalTransfer',
      ...proto.toObject(),
    }
  }

  public toAmino(): MsgExternalTransfer.Amino {
    const proto = this.toProto()

    return {
      type: 'exchange/MsgExternalTransfer',
      ...proto.toObject(),
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
}
