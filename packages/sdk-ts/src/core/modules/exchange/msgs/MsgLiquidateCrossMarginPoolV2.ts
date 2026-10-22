import * as InjectiveExchangeV2TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/tx_pb'
import { MsgBase } from '../../MsgBase.js'
import { toAminoJson } from '../../../tx/amino/toAminoJson.js'

export declare namespace MsgLiquidateCrossMarginPoolV2 {
  export interface Params {
    sender: string
    subaccountId: string
    quoteDenom: string
    /** synthetic-trade action from the RFQ contract, required for an active-market RFQ liquidation (chain v1.21+) */
    rfqAction?: string
  }

  export type Proto = InjectiveExchangeV2TxPb.MsgLiquidateCrossMarginPool
}

/**
 * @category Messages
 */
export default class MsgLiquidateCrossMarginPoolV2 extends MsgBase<
  MsgLiquidateCrossMarginPoolV2.Params,
  MsgLiquidateCrossMarginPoolV2.Proto
> {
  static fromJSON(
    params: MsgLiquidateCrossMarginPoolV2.Params,
  ): MsgLiquidateCrossMarginPoolV2 {
    return new MsgLiquidateCrossMarginPoolV2(params)
  }

  public toProto() {
    const { params } = this

    return InjectiveExchangeV2TxPb.MsgLiquidateCrossMarginPool.create({
      sender: params.sender,
      subaccountId: params.subaccountId,
      quoteDenom: params.quoteDenom,
      rfqAction: params.rfqAction ?? '',
    })
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v2.MsgLiquidateCrossMarginPool',
      ...proto,
    }
  }

  public toAmino() {
    return toAminoJson(
      InjectiveExchangeV2TxPb.MsgLiquidateCrossMarginPool,
      this.toProto(),
    )
  }

  public toAminoRaw() {
    const proto = this.toProto()

    return {
      type: 'exchange/v2/MsgLiquidateCrossMarginPool',
      value: {
        sender: proto.sender,
        subaccount_id: proto.subaccountId,
        quote_denom: proto.quoteDenom,
        // amino omits empty fields
        ...(proto.rfqAction && { rfq_action: proto.rfqAction }),
      },
    }
  }

  public toWeb3Gw() {
    const { value } = this.toAminoRaw()

    return {
      '@type': '/injective.exchange.v2.MsgLiquidateCrossMarginPool',
      ...value,
      // proto-JSON always carries the field
      rfq_action: this.params.rfqAction ?? '',
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v2.MsgLiquidateCrossMarginPool',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV2TxPb.MsgLiquidateCrossMarginPool.toBinary(
      this.toProto(),
    )
  }
}
