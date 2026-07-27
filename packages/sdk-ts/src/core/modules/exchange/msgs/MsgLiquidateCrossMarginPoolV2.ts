import * as InjectiveExchangeV2TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/tx_pb'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgLiquidateCrossMarginPoolV2 {
  export interface Params {
    sender: string
    subaccountId: string
    quoteDenom: string
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
    const proto = this.toProto()

    return {
      type: 'exchange/MsgLiquidateCrossMarginPool',
      value: {
        sender: proto.sender,
        subaccount_id: proto.subaccountId,
        quote_denom: proto.quoteDenom,
      },
    }
  }

  public toWeb3Gw() {
    const { value } = this.toAmino()

    return {
      '@type': '/injective.exchange.v2.MsgLiquidateCrossMarginPool',
      ...value,
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
