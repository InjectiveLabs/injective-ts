import {
  CosmosBaseV1Beta1Coin,
  InjectiveExchangeV1Beta1Tx,
} from '@injectivelabs/core-proto-ts'
import { MsgBase } from '../../MsgBase'
import snakecaseKeys from 'snakecase-keys'

export declare namespace MsgDeposit {
  export interface Params {
    subaccountId: string
    injectiveAddress: string
    amount: {
      amount: string
      denom: string
    }
  }

  export type Proto = InjectiveExchangeV1Beta1Tx.MsgDeposit
}

/**
 * @category Messages
 */
export default class MsgDeposit extends MsgBase<
  MsgDeposit.Params,
  MsgDeposit.Proto
> {
  static fromJSON(params: MsgDeposit.Params): MsgDeposit {
    return new MsgDeposit(params)
  }

  public toProto() {
    const { params } = this

    const amountCoin = CosmosBaseV1Beta1Coin.Coin.create()

    amountCoin.denom = params.amount.denom
    amountCoin.amount = params.amount.amount

    const message = InjectiveExchangeV1Beta1Tx.MsgDeposit.create()

    message.sender = params.injectiveAddress
    message.subaccountId = params.subaccountId
    message.amount = amountCoin

    return InjectiveExchangeV1Beta1Tx.MsgDeposit.fromPartial(message)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgDeposit',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto),
    }

    return {
      type: 'exchange/MsgDeposit',
      value: message,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgDeposit',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgDeposit',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV1Beta1Tx.MsgDeposit.encode(this.toProto()).finish()
  }
}
