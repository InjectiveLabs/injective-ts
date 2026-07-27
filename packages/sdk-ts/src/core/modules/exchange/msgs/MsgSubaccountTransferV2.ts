import * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb'
import * as InjectiveExchangeV2TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/tx_pb'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgSubaccountTransferV2 {
  export interface Params {
    sender: string
    sourceSubaccountId: string
    destinationSubaccountId: string
    amount: {
      amount: string
      denom: string
    }
  }

  export type Proto = InjectiveExchangeV2TxPb.MsgSubaccountTransfer
}

/**
 * @category Messages
 */
export default class MsgSubaccountTransferV2 extends MsgBase<
  MsgSubaccountTransferV2.Params,
  MsgSubaccountTransferV2.Proto
> {
  static fromJSON(
    params: MsgSubaccountTransferV2.Params,
  ): MsgSubaccountTransferV2 {
    return new MsgSubaccountTransferV2(params)
  }

  public toProto() {
    const { params } = this

    return InjectiveExchangeV2TxPb.MsgSubaccountTransfer.create({
      sender: params.sender,
      sourceSubaccountId: params.sourceSubaccountId,
      destinationSubaccountId: params.destinationSubaccountId,
      amount: CosmosBaseV1Beta1CoinPb.Coin.create(params.amount),
    })
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v2.MsgSubaccountTransfer',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()

    return {
      type: 'exchange/MsgSubaccountTransfer',
      value: {
        sender: proto.sender,
        source_subaccount_id: proto.sourceSubaccountId,
        destination_subaccount_id: proto.destinationSubaccountId,
        amount: proto.amount,
      },
    }
  }

  public toWeb3Gw() {
    const { value } = this.toAmino()

    return {
      '@type': '/injective.exchange.v2.MsgSubaccountTransfer',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v2.MsgSubaccountTransfer',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV2TxPb.MsgSubaccountTransfer.toBinary(
      this.toProto(),
    )
  }
}
