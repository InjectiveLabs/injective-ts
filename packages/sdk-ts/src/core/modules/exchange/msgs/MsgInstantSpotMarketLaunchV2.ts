import * as InjectiveExchangeV2TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/tx_pb'
import { MsgBase } from '../../MsgBase.js'
import { toLegacyDec } from './utils/legacyDec.js'
import { toAminoJson } from '../../../tx/amino/toAminoJson.js'
import { numberToCosmosSdkDecString } from '../../../../utils/numbers.js'

export declare namespace MsgInstantSpotMarketLaunchV2 {
  export interface Params {
    proposer: string
    market: {
      ticker: string
      baseDenom: string
      quoteDenom: string
      minNotional: string
      baseDecimals: number
      quoteDecimals: number
      minPriceTickSize: string
      minQuantityTickSize: string
    }
  }

  export type Proto = InjectiveExchangeV2TxPb.MsgInstantSpotMarketLaunch
}

const createMessage = (params: MsgInstantSpotMarketLaunchV2.Params) => {
  const message = InjectiveExchangeV2TxPb.MsgInstantSpotMarketLaunch.create({
    sender: params.proposer,
    ticker: params.market.ticker,
    baseDenom: params.market.baseDenom,
    quoteDenom: params.market.quoteDenom,
    minPriceTickSize: toLegacyDec(params.market.minPriceTickSize),
    minQuantityTickSize: toLegacyDec(params.market.minQuantityTickSize),
    minNotional: toLegacyDec(params.market.minNotional),
    baseDecimals: Number(params.market.baseDecimals),
    quoteDecimals: Number(params.market.quoteDecimals),
  })

  return message
}

/**
 * @category Messages
 */
export default class MsgInstantSpotMarketLaunchV2 extends MsgBase<
  MsgInstantSpotMarketLaunchV2.Params,
  MsgInstantSpotMarketLaunchV2.Proto
> {
  /** the chain cannot type `math.LegacyDec` fields for EIP712 v1 */
  static readonly eip712V1Supported = false

  static fromJSON(
    params: MsgInstantSpotMarketLaunchV2.Params,
  ): MsgInstantSpotMarketLaunchV2 {
    return new MsgInstantSpotMarketLaunchV2(params)
  }

  public toProto() {
    return createMessage(this.params)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v2.MsgInstantSpotMarketLaunch',
      ...proto,
    }
  }

  public toAmino() {
    return toAminoJson(
      InjectiveExchangeV2TxPb.MsgInstantSpotMarketLaunch,
      this.toProto(),
    )
  }

  public toAminoRaw() {
    const { params } = this
    const message = {
      sender: params.proposer,
      ticker: params.market.ticker,
      base_denom: params.market.baseDenom,
      quote_denom: params.market.quoteDenom,
      min_price_tick_size: params.market.minPriceTickSize,
      min_quantity_tick_size: params.market.minQuantityTickSize,
      min_notional: params.market.minNotional,
      base_decimals: params.market.baseDecimals,
      quote_decimals: params.market.quoteDecimals,
    }

    return {
      type: 'exchange/v2/MsgInstantSpotMarketLaunch',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAminoRaw()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v2.MsgInstantSpotMarketLaunch',
      ...value,
    }
  }

  public toEip712V2() {
    const { params } = this
    const web3gw = this.toWeb3Gw()

    const messageAdjusted = {
      ...web3gw,
      min_price_tick_size: numberToCosmosSdkDecString(
        params.market.minPriceTickSize,
      ),
      min_quantity_tick_size: numberToCosmosSdkDecString(
        params.market.minQuantityTickSize,
      ),
      min_notional: numberToCosmosSdkDecString(params.market.minNotional),
    }

    return messageAdjusted
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v2.MsgInstantSpotMarketLaunch',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV2TxPb.MsgInstantSpotMarketLaunch.toBinary(
      this.toProto(),
    )
  }
}
