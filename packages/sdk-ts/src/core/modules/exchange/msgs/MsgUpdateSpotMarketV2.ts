import snakecaseKeys from 'snakecase-keys'
import { toChainFormat } from '@injectivelabs/utils'
import { InjectiveExchangeV2Tx } from '@injectivelabs/core-proto-ts'
import { MsgBase } from '../../MsgBase.js'
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

  export type Proto = InjectiveExchangeV2Tx.MsgUpdateSpotMarket
}

const createMessage = (params: MsgUpdateSpotMarketV2.Params) => {
  const message = InjectiveExchangeV2Tx.MsgUpdateSpotMarket.create()

  message.admin = params.admin
  message.marketId = params.marketId
  message.newTicker = params.newTicker || ''
  message.newMinNotional = params.newMinNotional || '0'
  message.newMinPriceTickSize = params.newMinPriceTickSize || '0'
  message.newMinQuantityTickSize = params.newMinQuantityTickSize || '0'

  return InjectiveExchangeV2Tx.MsgUpdateSpotMarket.fromPartial(message)
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
    const { params: initialParams } = this

    console.log({ initialParams })

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
    } as MsgUpdateSpotMarketV2.Params

    return createMessage(params)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v2.MsgUpdateSpotMarket',
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
      type: 'exchange/MsgUpdateSpotMarket',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v2.MsgUpdateSpotMarket',
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
    return InjectiveExchangeV2Tx.MsgUpdateSpotMarket.encode(
      this.toProto(),
    ).finish()
  }
}
