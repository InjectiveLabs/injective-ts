import * as InjectiveExchangeV2TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/tx_pb'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgOffsetPositionV2 {
  export interface Params {
    sender: string
    subaccountId: string
    marketId: string
    offsettingSubaccountIds: string[]
  }

  export type Proto = InjectiveExchangeV2TxPb.MsgOffsetPosition
}

/**
 * @category Messages
 */
export default class MsgOffsetPositionV2 extends MsgBase<
  MsgOffsetPositionV2.Params,
  MsgOffsetPositionV2.Proto
> {
  static fromJSON(params: MsgOffsetPositionV2.Params): MsgOffsetPositionV2 {
    return new MsgOffsetPositionV2(params)
  }

  public toProto() {
    const { params } = this

    return InjectiveExchangeV2TxPb.MsgOffsetPosition.create({
      sender: params.sender,
      subaccountId: params.subaccountId,
      marketId: params.marketId,
      offsettingSubaccountIds: params.offsettingSubaccountIds,
    })
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v2.MsgOffsetPosition',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()

    return {
      type: 'exchange/MsgOffsetPosition',
      value: {
        sender: proto.sender,
        subaccount_id: proto.subaccountId,
        market_id: proto.marketId,
        offsetting_subaccount_ids: proto.offsettingSubaccountIds,
      },
    }
  }

  public toWeb3Gw() {
    const { value } = this.toAmino()

    return {
      '@type': '/injective.exchange.v2.MsgOffsetPosition',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v2.MsgOffsetPosition',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV2TxPb.MsgOffsetPosition.toBinary(this.toProto())
  }
}
