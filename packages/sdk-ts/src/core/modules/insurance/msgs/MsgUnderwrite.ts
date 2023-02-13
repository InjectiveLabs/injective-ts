import { MsgUnderwrite as BaseMsgUnderwrite } from '@injectivelabs/chain-api/injective/insurance/v1beta1/tx_pb'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import { MsgBase } from '../../MsgBase'
import snakecaseKeys from 'snakecase-keys'

export declare namespace MsgUnderwrite {
  export interface Params {
    marketId: string
    amount: {
      denom: string
      amount: string
    }
    injectiveAddress: string
  }

  export type Proto = BaseMsgUnderwrite

  export type Object = BaseMsgUnderwrite.AsObject
}

/**
 * @category Messages
 */
export default class MsgUnderwrite extends MsgBase<
  MsgUnderwrite.Params,
  MsgUnderwrite.Proto,
  MsgUnderwrite.Object
> {
  static fromJSON(params: MsgUnderwrite.Params): MsgUnderwrite {
    return new MsgUnderwrite(params)
  }

  public toProto() {
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

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.insurance.v1beta1.MsgUnderwrite',
      ...proto.toObject(),
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto.toObject()),
    }

    return {
      type: 'insurance/MsgUnderwrite',
      value: message,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.insurance.v1beta1.MsgUnderwrite',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.insurance.v1beta1.MsgUnderwrite',
      message: proto,
    }
  }
}
