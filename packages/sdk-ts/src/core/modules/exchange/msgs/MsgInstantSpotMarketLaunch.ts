import snakecaseKeys from 'snakecase-keys'
import { InjectiveExchangeV1Beta1Tx } from '@injectivelabs/core-proto-ts'
import {
  amountToCosmosSdkDecAmount,
  numberToCosmosSdkDecString,
} from '../../../../utils/numbers.js'
import { MsgBase } from '../../MsgBase.js'

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
    const { params: initialParams } = this

    const params = {
      ...initialParams,
      market: {
        ...initialParams.market,
        minPriceTickSize: numberToCosmosSdkDecString(
          initialParams.market.minPriceTickSize,
        ),
        minQuantityTickSize: numberToCosmosSdkDecString(
          initialParams.market.minQuantityTickSize,
        ),
        minNotional: numberToCosmosSdkDecString(
          initialParams.market.minNotional,
        ),
      },
    } as MsgInstantSpotMarketLaunch.Params

    const msg = createMessage(params)
    const message = {
      ...snakecaseKeys(msg),
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
