import snakecaseKeys from 'snakecase-keys'
import { InjectiveExchangeV1Beta1Tx } from '@injectivelabs/core-proto-ts'
import { MsgBase } from '../../MsgBase.js'
import {
  amountToCosmosSdkDecAmount,
  numberToCosmosSdkDecString,
} from '../../../../utils/numbers.js'

export declare namespace MsgInstantSpotMarketLaunch {
  export interface Params {
    proposer: string
    market: {
      sender: string
      ticker: string
      baseDenom: string
      quoteDenom: string
      minNotional: string
      minPriceTickSize: string
      minQuantityTickSize: string
    }
  }

  export type Proto = InjectiveExchangeV1Beta1Tx.MsgInstantSpotMarketLaunch
}

const createMessage = (params: MsgInstantSpotMarketLaunch.Params) => {
  const message = InjectiveExchangeV1Beta1Tx.MsgInstantSpotMarketLaunch.create()

  message.sender = params.proposer
  message.ticker = params.market.ticker
  message.baseDenom = params.market.baseDenom
  message.quoteDenom = params.market.quoteDenom
  message.minPriceTickSize = params.market.minPriceTickSize
  message.minQuantityTickSize = params.market.minQuantityTickSize
  message.minNotional = params.market.minNotional

  return InjectiveExchangeV1Beta1Tx.MsgInstantSpotMarketLaunch.fromPartial(
    message,
  )
}

/**
 * @category Messages
 */
export default class MsgInstantSpotMarketLaunch extends MsgBase<
  MsgInstantSpotMarketLaunch.Params,
  MsgInstantSpotMarketLaunch.Proto
> {
  static fromJSON(
    params: MsgInstantSpotMarketLaunch.Params,
  ): MsgInstantSpotMarketLaunch {
    return new MsgInstantSpotMarketLaunch(params)
  }

  public toProto() {
    const { params: initialParams } = this

    const params = {
      ...initialParams,
      market: {
        ...initialParams.market,
        minPriceTickSize: amountToCosmosSdkDecAmount(
          initialParams.market.minPriceTickSize,
        ).toFixed(),
        minQuantityTickSize: amountToCosmosSdkDecAmount(
          initialParams.market.minQuantityTickSize,
        ).toFixed(),
        minNotional: amountToCosmosSdkDecAmount(
          initialParams.market.minNotional,
        ).toFixed(),
      },
    } as MsgInstantSpotMarketLaunch.Params

    return createMessage(params)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgInstantSpotMarketLaunch',
      ...proto,
    }
  }

  public toAmino() {
    const { params } = this

    const message = {
      ...snakecaseKeys(createMessage(params)),
    }

    return {
      type: 'exchange/MsgInstantSpotMarketLaunch',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgInstantSpotMarketLaunch',
      ...value,
    }
  }

  public toEip712() {
    const amino = this.toAmino()
    const { type, value } = amino

    const messageAdjusted = {
      ...value,
      min_price_tick_size: amountToCosmosSdkDecAmount(
        value.min_price_tick_size,
      ).toFixed(),
      min_quantity_tick_size: amountToCosmosSdkDecAmount(
        value.min_quantity_tick_size,
      ).toFixed(),
      min_notional: amountToCosmosSdkDecAmount(value.min_notional).toFixed(),
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
      type: '/injective.exchange.v1beta1.MsgInstantSpotMarketLaunch',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV1Beta1Tx.MsgInstantSpotMarketLaunch.encode(
      this.toProto(),
    ).finish()
  }
}
