import snakecaseKeys from 'snakecase-keys'
import { toChainFormat } from '@injectivelabs/utils'
import { InjectiveExchangeV2Tx } from '@injectivelabs/core-proto-ts'
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
  }

  export type Proto = InjectiveExchangeV2Tx.MsgUpdateDerivativeMarket
}

const createMessage = (params: MsgUpdateDerivativeMarketV2.Params) => {
  const message = InjectiveExchangeV2Tx.MsgUpdateDerivativeMarket.create()

  message.admin = params.admin
  message.marketId = params.marketId
  message.newTicker = params.newTicker || ''
  message.newMinNotional = params.newMinNotional || '0'
  message.newMinPriceTickSize = params.newMinPriceTickSize || '0'
  message.newMinQuantityTickSize = params.newMinQuantityTickSize || '0'
  message.newInitialMarginRatio = params.newInitialMarginRatio || '0'
  message.newMaintenanceMarginRatio = params.newMaintenanceMarginRatio || '0'
  message.newReduceMarginRatio = params.newReduceMarginRatio || '0'

  return InjectiveExchangeV2Tx.MsgUpdateDerivativeMarket.fromPartial(message)
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
    const msg = createMessage(params)
    const message = {
      ...snakecaseKeys(msg),
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
    const web3gw = this.toWeb3Gw()

    const messageAdjusted = {
      ...web3gw,
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
    return InjectiveExchangeV2Tx.MsgUpdateDerivativeMarket.encode(
      this.toProto(),
    ).finish()
  }
}
