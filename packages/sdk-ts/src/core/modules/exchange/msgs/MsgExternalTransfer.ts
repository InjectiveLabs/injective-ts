import * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb'
import * as InjectiveExchangeV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/tx_pb'
import { MsgBase } from '../../MsgBase.js'

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

  export type Proto = InjectiveExchangeV1Beta1TxPb.MsgExternalTransfer
}

/**
 * @category Messages
 */
export default class MsgExternalTransfer extends MsgBase<
  MsgExternalTransfer.Params,
  MsgExternalTransfer.Proto
> {
  static fromJSON(params: MsgExternalTransfer.Params): MsgExternalTransfer {
    return new MsgExternalTransfer(params)
  }

  public toProto() {
    const { params } = this

    const amountCoin = CosmosBaseV1Beta1CoinPb.Coin.create({
      denom: params.amount.denom,
      amount: params.amount.amount,
    })

    const message = InjectiveExchangeV1Beta1TxPb.MsgExternalTransfer.create({
      sender: params.injectiveAddress,
      sourceSubaccountId: params.srcSubaccountId,
      destinationSubaccountId: params.dstSubaccountId,
      amount: amountCoin,
    })

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgExternalTransfer',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      sender: proto.sender,
      source_subaccount_id: proto.sourceSubaccountId,
      destination_subaccount_id: proto.destinationSubaccountId,
      amount: proto.amount,
    }

    return {
      type: 'exchange/MsgExternalTransfer',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgExternalTransfer',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgExternalTransfer',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV1Beta1TxPb.MsgExternalTransfer.toBinary(
      this.toProto(),
    )
  }
}
