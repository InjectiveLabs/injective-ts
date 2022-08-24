import { MsgUnderwrite as BaseMsgUnderwrite } from '@injectivelabs/chain-api/injective/insurance/v1beta1/tx_pb'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
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

  export interface Data extends BaseMsgUnderwrite.AsObject {
    '@type': '/injective.insurance.v1beta1.MsgUnderwrite'
  }

  export interface Amino extends BaseMsgUnderwrite.AsObject {
    type: 'insurance/MsgUnderwrite'
  }

  export interface Web3 extends BaseMsgUnderwrite.AsObject {
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

    const amountCoin = new Coin()
    amountCoin.setAmount(params.amount.amount)
    amountCoin.setDenom(params.amount.denom)

    const message = new BaseMsgUnderwrite()
    message.setDeposit(amountCoin)
    message.setMarketId(params.marketId)
    message.setSender(params.injectiveAddress)

    return message
  }

  public toData(): MsgUnderwrite.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.insurance.v1beta1.MsgUnderwrite',
      ...proto.toObject(),
    }
  }

  public toAmino(): MsgUnderwrite.Amino {
    const proto = this.toProto()

    return {
      type: 'insurance/MsgUnderwrite',
      ...proto.toObject(),
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
}
