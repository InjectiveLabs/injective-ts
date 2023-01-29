import { MsgUnderwrite as BaseMsgUnderwrite } from '@injectivelabs/core-proto-ts/injective/insurance/v1beta1/tx'
import { Coin } from '@injectivelabs/core-proto-ts/cosmos/base/v1beta1/coin'
import { MsgBase } from '../../MsgBase'

export declare namespace MsgUnderwrite {
  export interface Params {
    marketId: string
    amount: {
      denom: string
      amount: string
    }
    injectiveAddress: string
  }

  export interface DirectSign {
    type: '/injective.insurance.v1beta1.MsgUnderwrite'
    message: BaseMsgUnderwrite
  }

  export interface Data extends BaseMsgUnderwrite {
    '@type': '/injective.insurance.v1beta1.MsgUnderwrite'
  }

  export interface Amino extends BaseMsgUnderwrite {
    type: 'insurance/MsgUnderwrite'
  }

  export interface Web3 extends BaseMsgUnderwrite {
    '@type': '/injective.insurance.v1beta1.MsgUnderwrite'
  }

  export type Proto = BaseMsgUnderwrite
}

/**
 * @category Messages
 */
export default class MsgUnderwrite extends MsgBase<
  MsgUnderwrite.Params,
  MsgUnderwrite.Data,
  MsgUnderwrite.Proto,
  MsgUnderwrite.Amino,
  MsgUnderwrite.DirectSign
> {
  static fromJSON(params: MsgUnderwrite.Params): MsgUnderwrite {
    return new MsgUnderwrite(params)
  }

  public toProto(): MsgUnderwrite.Proto {
    const { params } = this

    const amountCoin = Coin.create()
    amountCoin.amount = params.amount.amount
    amountCoin.denom = params.amount.denom

    const message = BaseMsgUnderwrite.create()
    message.deposit = amountCoin
    message.marketId = params.marketId
    message.sender = params.injectiveAddress

    return message
  }

  public toData(): MsgUnderwrite.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.insurance.v1beta1.MsgUnderwrite',
      ...proto,
    }
  }

  public toAmino(): MsgUnderwrite.Amino {
    const proto = this.toProto()

    return {
      type: 'insurance/MsgUnderwrite',
      ...proto,
    }
  }

  public toWeb3(): MsgUnderwrite.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/injective.insurance.v1beta1.MsgUnderwrite',
      ...rest,
    } as unknown as MsgUnderwrite.Web3
  }

  public toDirectSign(): MsgUnderwrite.DirectSign {
    const proto = this.toProto()

    return {
      type: '/injective.insurance.v1beta1.MsgUnderwrite',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return BaseMsgUnderwrite.encode(this.toProto()).finish()
  }
}
