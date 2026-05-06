import * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb'
import * as InjectiveExchangeV2TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/tx_pb'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgExternalTransferV2 {
  export interface Params {
    srcSubaccountId: string
    dstSubaccountId: string
    injectiveAddress: string
    amount: {
      amount: string
      denom: string
    }
  }

  export type Proto = InjectiveExchangeV2TxPb.MsgExternalTransfer
}

/**
 * @category Messages
 */
export default class MsgExternalTransferV2 extends MsgBase<
  MsgExternalTransferV2.Params,
  MsgExternalTransferV2.Proto
> {
  static fromJSON(params: MsgExternalTransferV2.Params): MsgExternalTransferV2 {
    return new MsgExternalTransferV2(params)
  }

  public toProto() {
    const { params } = this

    const amountCoin = CosmosBaseV1Beta1CoinPb.Coin.create({
      denom: params.amount.denom,
      amount: params.amount.amount,
    })

    const message = InjectiveExchangeV2TxPb.MsgExternalTransfer.create({
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
      '@type': '/injective.exchange.v2.MsgExternalTransfer',
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
      '@type': '/injective.exchange.v2.MsgExternalTransfer',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v2.MsgExternalTransfer',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV2TxPb.MsgExternalTransfer.toBinary(this.toProto())
  }
}
