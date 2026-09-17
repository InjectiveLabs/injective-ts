import * as InjectiveExchangeV2TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/tx_pb'
import { MsgBase } from '../../MsgBase.js'
import type * as InjectiveExchangeV2ExchangePb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/exchange_pb'

export declare namespace MsgUpdateSwapParamsV2 {
  export interface Params {
    sender: string
    swapParams: InjectiveExchangeV2ExchangePb.SwapParams
  }

  export type Proto = InjectiveExchangeV2TxPb.MsgUpdateSwapParams
}

/**
 * @category Messages
 */
export default class MsgUpdateSwapParamsV2 extends MsgBase<
  MsgUpdateSwapParamsV2.Params,
  MsgUpdateSwapParamsV2.Proto
> {
  static fromJSON(params: MsgUpdateSwapParamsV2.Params): MsgUpdateSwapParamsV2 {
    return new MsgUpdateSwapParamsV2(params)
  }

  public toProto() {
    const { params } = this

    return InjectiveExchangeV2TxPb.MsgUpdateSwapParams.create(params)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v2.MsgUpdateSwapParams',
      ...proto,
    }
  }

  public toAmino() {
    const { params } = this

    return {
      type: 'exchange/MsgUpdateSwapParams',
      value: {
        sender: params.sender,
        swap_params: {
          enabled: params.swapParams.enabled,
          allowed_markets: params.swapParams.allowedMarkets,
        },
      },
    }
  }

  public toWeb3Gw() {
    const { value } = this.toAmino()

    return {
      '@type': '/injective.exchange.v2.MsgUpdateSwapParams',
      ...value,
    }
  }

  public toEip712() {
    const { type, value } = this.toAmino()

    return { type, value }
  }

  public toEip712V2() {
    return this.toWeb3Gw()
  }

  public toDirectSign() {
    return {
      type: '/injective.exchange.v2.MsgUpdateSwapParams',
      message: this.toProto(),
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV2TxPb.MsgUpdateSwapParams.toBinary(this.toProto())
  }
}
