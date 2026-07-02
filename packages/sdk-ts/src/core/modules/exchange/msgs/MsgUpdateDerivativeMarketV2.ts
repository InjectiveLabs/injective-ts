import { toChainFormat } from '@injectivelabs/utils'
import * as InjectiveExchangeV2TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/tx_pb'
import * as InjectiveExchangeV2ProposalPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/proposal_pb'
import { MsgBase } from '../../MsgBase.js'
import { numberToCosmosSdkDecString } from '../../../../utils/numbers.js'

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
    crossMarginEligibility?: InjectiveExchangeV2ProposalPb.CrossMarginEligibility
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
    newMinNotional: params.newMinNotional || '0',
    newMinPriceTickSize: params.newMinPriceTickSize || '0',
    newMinQuantityTickSize: params.newMinQuantityTickSize || '0',
    newInitialMarginRatio: params.newInitialMarginRatio || '0',
    newMaintenanceMarginRatio: params.newMaintenanceMarginRatio || '0',
    newReduceMarginRatio: params.newReduceMarginRatio || '0',
    crossMarginEligibility:
      params.crossMarginEligibility ?? defaultCrossMarginEligibility,
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
    const { params: initialParams } = this

    const params = {
      ...initialParams,
      newMinNotional: toChainFormat(
        initialParams.newMinNotional || '0',
      ).toFixed(),
      newMinQuantityTickSize: toChainFormat(
        initialParams.newMinQuantityTickSize || '0',
      ).toFixed(),
      newMinPriceTickSize: toChainFormat(
        initialParams.newMinPriceTickSize || '0',
      ).toFixed(),
      newInitialMarginRatio: toChainFormat(
        initialParams.newInitialMarginRatio || '0',
      ).toFixed(),
      newMaintenanceMarginRatio: toChainFormat(
        initialParams.newMaintenanceMarginRatio || '0',
      ).toFixed(),
      newReduceMarginRatio: toChainFormat(
        initialParams.newReduceMarginRatio || '0',
      ).toFixed(),
      crossMarginEligibility: initialParams.crossMarginEligibility,
    } as MsgUpdateDerivativeMarketV2.Params

    return createMessage(params)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v2.MsgUpdateDerivativeMarket',
      ...proto,
    }
  }

  public toAmino() {
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
      cross_margin_eligibility:
        params.crossMarginEligibility ?? defaultCrossMarginEligibility,
    }

    return {
      type: 'exchange/MsgUpdateDerivativeMarket',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v2.MsgUpdateDerivativeMarket',
      ...value,
    }
  }

  public toEip712() {
    const amino = this.toAmino()
    const { type, value } = amino

    const messageAdjusted = {
      ...value,
    }

    return {
      type,
      value: messageAdjusted,
    }
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
      new_open_notional_cap: {},
      cross_margin_eligibility:
        InjectiveExchangeV2ProposalPb.CrossMarginEligibility[
          params.crossMarginEligibility ?? defaultCrossMarginEligibility
        ],
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
