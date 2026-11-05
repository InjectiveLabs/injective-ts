import { toChainFormat } from '@injectivelabs/utils'
import * as InjectiveExchangeV2TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/tx_pb'
import * as InjectiveExchangeV2ProposalPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/proposal_pb'
import { MsgBase } from '../../MsgBase.js'
import { toAminoJson } from '../../../tx/amino/toAminoJson.js'
import { numberToCosmosSdkDecString } from '../../../../utils/numbers.js'
import { toReferencePriceGateConfig } from './utils/referencePriceGateConfig.js'
import {
  toOpenNotionalCap,
  openNotionalCapToChainFormat,
} from './utils/openNotionalCap.js'
import type * as InjectiveExchangeV2MarketPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/market_pb'

export declare namespace MsgUpdateDerivativeMarketV2 {
  export interface Params {
    admin: string
    marketId: string
    newTicker?: string
    newMinNotional?: string
    newMinPriceTickSize?: string
    newMinQuantityTickSize?: string
    newInitialMarginRatio?: string
    newMaintenanceMarginRatio?: string
    newReduceMarginRatio?: string
    newOpenNotionalCap?: InjectiveExchangeV2MarketPb.OpenNotionalCap
    crossMarginEligibility?: InjectiveExchangeV2ProposalPb.CrossMarginEligibility
    newReferencePriceGateConfig?: InjectiveExchangeV2MarketPb.ReferencePriceGateConfig
  }

  export type Proto = InjectiveExchangeV2TxPb.MsgUpdateDerivativeMarket
}

const defaultCrossMarginEligibility =
  InjectiveExchangeV2ProposalPb.CrossMarginEligibility
    .CM_ELIGIBILITY_UNSPECIFIED

const createMessage = (params: MsgUpdateDerivativeMarketV2.Params) => {
  const message = InjectiveExchangeV2TxPb.MsgUpdateDerivativeMarket.create({
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
    newInitialMarginRatio: toChainFormat(
      params.newInitialMarginRatio || '0',
    ).toFixed(),
    newMaintenanceMarginRatio: toChainFormat(
      params.newMaintenanceMarginRatio || '0',
    ).toFixed(),
    newReduceMarginRatio: toChainFormat(
      params.newReduceMarginRatio || '0',
    ).toFixed(),
    ...(params.newOpenNotionalCap && {
      newOpenNotionalCap: openNotionalCapToChainFormat(
        params.newOpenNotionalCap,
      ),
    }),
    crossMarginEligibility:
      params.crossMarginEligibility ?? defaultCrossMarginEligibility,
    ...(params.newReferencePriceGateConfig && {
      newReferencePriceGateConfig: params.newReferencePriceGateConfig,
    }),
  })

  return message
}

/**
 * @category Messages
 */
export default class MsgUpdateDerivativeMarketV2 extends MsgBase<
  MsgUpdateDerivativeMarketV2.Params,
  MsgUpdateDerivativeMarketV2.Proto
> {
  static fromJSON(
    params: MsgUpdateDerivativeMarketV2.Params,
  ): MsgUpdateDerivativeMarketV2 {
    return new MsgUpdateDerivativeMarketV2(params)
  }

  public toProto() {
    return createMessage(this.params)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v2.MsgUpdateDerivativeMarket',
      ...proto,
    }
  }

  public toAmino() {
    return toAminoJson(
      InjectiveExchangeV2TxPb.MsgUpdateDerivativeMarket,
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
      new_initial_margin_ratio: params.newInitialMarginRatio,
      new_maintenance_margin_ratio: params.newMaintenanceMarginRatio,
      new_reduce_margin_ratio: params.newReduceMarginRatio,
      ...(params.newOpenNotionalCap && {
        new_open_notional_cap: toOpenNotionalCap(params.newOpenNotionalCap),
      }),
      cross_margin_eligibility:
        params.crossMarginEligibility ?? defaultCrossMarginEligibility,
      ...(params.newReferencePriceGateConfig && {
        new_reference_price_gate_config: toReferencePriceGateConfig(
          params.newReferencePriceGateConfig,
        ),
      }),
    }

    return {
      type: 'exchange/v2/MsgUpdateDerivativeMarket',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAminoRaw()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v2.MsgUpdateDerivativeMarket',
      ...value,
    }
  }

  /** the chain cannot type `math.LegacyDec` fields for EIP712 v1 */
  public toEip712(): never {
    return this.eip712V1Unsupported('MsgUpdateDerivativeMarketV2')
  }

  public toEip712V2() {
    const { params } = this

    const messageAdjusted = {
      '@type': '/injective.exchange.v2.MsgUpdateDerivativeMarket',
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
      new_initial_margin_ratio: numberToCosmosSdkDecString(
        params.newInitialMarginRatio || '0',
      ),
      new_maintenance_margin_ratio: numberToCosmosSdkDecString(
        params.newMaintenanceMarginRatio || '0',
      ),
      new_reduce_margin_ratio: numberToCosmosSdkDecString(
        params.newReduceMarginRatio || '0',
      ),
      new_open_notional_cap:
        toOpenNotionalCap(
          params.newOpenNotionalCap,
          numberToCosmosSdkDecString,
        ) ?? {},
      cross_margin_eligibility:
        InjectiveExchangeV2ProposalPb.CrossMarginEligibility[
          params.crossMarginEligibility ?? defaultCrossMarginEligibility
        ],
      new_reference_price_gate_config: toReferencePriceGateConfig(
        params.newReferencePriceGateConfig,
      ),
    }

    return messageAdjusted
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v2.MsgUpdateDerivativeMarket',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV2TxPb.MsgUpdateDerivativeMarket.toBinary(
      this.toProto(),
    )
  }
}
