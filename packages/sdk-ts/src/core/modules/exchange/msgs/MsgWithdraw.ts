import * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb'
import * as InjectiveExchangeV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/tx_pb'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgWithdraw {
  export interface Params {
    subaccountId: string
    injectiveAddress: string
    amount: {
      amount: string
      denom: string
    }
  }

  export type Proto = InjectiveExchangeV1Beta1TxPb.MsgWithdraw
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

    const amountCoin = CosmosBaseV1Beta1CoinPb.Coin.create({
      denom: params.amount.denom,
      amount: params.amount.amount,
    })

    const message = InjectiveExchangeV1Beta1TxPb.MsgWithdraw.create({
      sender: params.injectiveAddress,
      subaccountId: params.subaccountId,
      amount: amountCoin,
    })

    return message
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
      sender: proto.sender,
      subaccount_id: proto.subaccountId,
      amount: proto.amount,
    }

    return {
      type: 'exchange/MsgWithdraw',
      value: message,
    }
  }

  public toWeb3Gw() {
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
    return InjectiveExchangeV1Beta1TxPb.MsgWithdraw.toBinary(this.toProto())
  }
}
