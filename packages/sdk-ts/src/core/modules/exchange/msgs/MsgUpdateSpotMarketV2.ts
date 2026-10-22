import { toChainFormat } from '@injectivelabs/utils'
import * as InjectiveExchangeV2TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/tx_pb'
import { MsgBase } from '../../MsgBase.js'
import { toAminoJson } from '../../../tx/amino/toAminoJson.js'
import { numberToCosmosSdkDecString } from '../../../../utils/numbers.js'

export declare namespace MsgUpdateSpotMarketV2 {
  export interface Params {
    admin: string
    marketId: string
    newTicker?: string
    newMinNotional?: string
    newMinPriceTickSize?: string
    newMinQuantityTickSize?: string
  }

  export type Proto = InjectiveExchangeV2TxPb.MsgUpdateSpotMarket
}

const createMessage = (params: MsgUpdateSpotMarketV2.Params) => {
  const message = InjectiveExchangeV2TxPb.MsgUpdateSpotMarket.create({
    admin: params.admin,
    marketId: params.marketId,
    newTicker: params.newTicker || '',
    // params are human-readable, the proto stores LegacyDec (value scaled by 1e18)
    newMinNotional: toChainFormat(params.newMinNotional || '0').toFixed(),
    newMinPriceTickSize: toChainFormat(
      params.newMinPriceTickSize || '0',
    ).toFixed(),
    newMinQuantityTickSize: toChainFormat(
      params.newMinQuantityTickSize || '0',
    ).toFixed(),
  })

  return message
}

/**
 * @category Messages
 */
export default class MsgUpdateSpotMarketV2 extends MsgBase<
  MsgUpdateSpotMarketV2.Params,
  MsgUpdateSpotMarketV2.Proto
> {
  static fromJSON(params: MsgUpdateSpotMarketV2.Params): MsgUpdateSpotMarketV2 {
    return new MsgUpdateSpotMarketV2(params)
  }

  public toProto() {
    return createMessage(this.params)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v2.MsgUpdateSpotMarket',
      ...proto,
    }
  }

  public toAmino() {
    return toAminoJson(
      InjectiveExchangeV2TxPb.MsgUpdateSpotMarket,
      this.toProto(),
    )
  }

  public toAminoRaw() {
    const { params } = this
    const message = {
      admin: params.admin,
      market_id: params.marketId,
      new_ticker: params.newTicker || '',
      new_min_notional: params.newMinNotional,
      new_min_price_tick_size: params.newMinPriceTickSize,
      new_min_quantity_tick_size: params.newMinQuantityTickSize,
    }

    return {
      type: 'exchange/v2/MsgUpdateSpotMarket',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAminoRaw()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v2.MsgUpdateSpotMarket',
      ...value,
    }
  }

  /** the chain cannot type `math.LegacyDec` fields for EIP712 v1 */
  public toEip712(): never {
    return this.eip712V1Unsupported('MsgUpdateSpotMarketV2')
  }

  public toEip712V2() {
    const { params } = this

    const messageAdjusted = {
      '@type': '/injective.exchange.v2.MsgUpdateSpotMarket',
      admin: params.admin,
      market_id: params.marketId,
      new_ticker: params.newTicker || '',
      new_min_price_tick_size: numberToCosmosSdkDecString(
        params.newMinPriceTickSize || '0',
      ),
      new_min_quantity_tick_size: numberToCosmosSdkDecString(
        params.newMinQuantityTickSize || '0',
      ),
      new_min_notional: numberToCosmosSdkDecString(
        params.newMinNotional || '0',
      ),
    }

    return messageAdjusted
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v2.MsgUpdateSpotMarket',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV2TxPb.MsgUpdateSpotMarket.toBinary(this.toProto())
  }
}
