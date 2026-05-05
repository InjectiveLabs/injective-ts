import * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb'
import * as InjectiveExchangeV2TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/tx_pb'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgDepositV2 {
  export interface Params {
    subaccountId: string
    injectiveAddress: string
    amount: {
      amount: string
      denom: string
    }
  }

  export type Proto = InjectiveExchangeV2TxPb.MsgDeposit
}

/**
 * @category Messages
 */
export default class MsgDepositV2 extends MsgBase<
  MsgDepositV2.Params,
  MsgDepositV2.Proto
> {
  static fromJSON(params: MsgDepositV2.Params): MsgDepositV2 {
    return new MsgDepositV2(params)
  }

  public toProto() {
    const { params } = this

    const amountCoin = CosmosBaseV1Beta1CoinPb.Coin.create({
      denom: params.amount.denom,
      amount: params.amount.amount,
    })

    const message = InjectiveExchangeV2TxPb.MsgDeposit.create({
      sender: params.injectiveAddress,
      subaccountId: params.subaccountId,
      amount: amountCoin,
    })

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v2.MsgDeposit',
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
      type: 'exchange/MsgDeposit',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v2.MsgDeposit',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v2.MsgDeposit',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV2TxPb.MsgDeposit.toBinary(this.toProto())
  }
}
