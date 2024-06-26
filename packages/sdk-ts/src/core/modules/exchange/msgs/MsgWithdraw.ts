import {
  CosmosBaseV1Beta1Coin,
  InjectiveExchangeV1Beta1Tx,
} from '@injectivelabs/core-proto-ts'
import { MsgBase } from '../../MsgBase'
import snakecaseKeys from 'snakecase-keys'

export declare namespace MsgWithdraw {
  export interface Params {
    subaccountId: string
    injectiveAddress: string
    amount: {
      amount: string
      denom: string
    }
  }

  export type Proto = InjectiveExchangeV1Beta1Tx.MsgWithdraw
}

/**
 * @category Messages
 */
export default class MsgWithdraw extends MsgBase<
  MsgWithdraw.Params,
  MsgWithdraw.Proto
> {
  static fromJSON(params: MsgWithdraw.Params): MsgWithdraw {
    return new MsgWithdraw(params)
  }

  public toProto() {
    const { params } = this

    const amountCoin = CosmosBaseV1Beta1Coin.Coin.create()

    amountCoin.denom = params.amount.denom
    amountCoin.amount = params.amount.amount

    const message = InjectiveExchangeV1Beta1Tx.MsgWithdraw.create()

    message.sender = params.injectiveAddress
    message.subaccountId = params.subaccountId
    message.amount = amountCoin

    return InjectiveExchangeV1Beta1Tx.MsgWithdraw.fromPartial(message)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgWithdraw',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto),
    }

    return {
      type: 'exchange/MsgWithdraw',
      value: message,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgWithdraw',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgWithdraw',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV1Beta1Tx.MsgWithdraw.encode(
      this.toProto(),
    ).finish()
  }
}
