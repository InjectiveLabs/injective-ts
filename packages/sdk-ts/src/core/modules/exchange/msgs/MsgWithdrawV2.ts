import * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb'
import * as InjectiveExchangeV2TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/tx_pb'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgWithdrawV2 {
  export interface Params {
    subaccountId: string
    injectiveAddress: string
    amount: {
      amount: string
      denom: string
    }
  }

  export type Proto = InjectiveExchangeV2TxPb.MsgWithdraw
}

/**
 * @category Messages
 */
export default class MsgWithdrawV2 extends MsgBase<
  MsgWithdrawV2.Params,
  MsgWithdrawV2.Proto
> {
  static fromJSON(params: MsgWithdrawV2.Params): MsgWithdrawV2 {
    return new MsgWithdrawV2(params)
  }

  public toProto() {
    const { params } = this

    const amountCoin = CosmosBaseV1Beta1CoinPb.Coin.create({
      denom: params.amount.denom,
      amount: params.amount.amount,
    })

    const message = InjectiveExchangeV2TxPb.MsgWithdraw.create({
      sender: params.injectiveAddress,
      subaccountId: params.subaccountId,
      amount: amountCoin,
    })

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v2.MsgWithdraw',
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
      '@type': '/injective.exchange.v2.MsgWithdraw',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v2.MsgWithdraw',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV2TxPb.MsgWithdraw.toBinary(this.toProto())
  }
}
