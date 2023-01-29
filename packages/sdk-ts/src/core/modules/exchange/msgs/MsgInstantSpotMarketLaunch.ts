import { MsgInstantSpotMarketLaunch as BaseMsgInstantSpotMarketLaunch } from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/tx'
import { amountToCosmosSdkDecAmount } from '../../../../utils/numbers'
import { MsgBase } from '../../MsgBase'

export declare namespace MsgInstantSpotMarketLaunch {
  export interface Params {
    proposer: string
    market: {
      sender: string
      ticker: string
      baseDenom: string
      quoteDenom: string
      minPriceTickSize: string
      minQuantityTickSize: string
    }
  }

  export interface DirectSign {
    type: '/injective.exchange.v1beta1.MsgInstantSpotMarketLaunch'
    message: BaseMsgInstantSpotMarketLaunch
  }

  export interface Data extends BaseMsgInstantSpotMarketLaunch {
    '@type': '/injective.exchange.v1beta1.MsgInstantSpotMarketLaunch'
  }

  export interface Amino extends BaseMsgInstantSpotMarketLaunch {
    type: 'exchange/MsgInstantSpotMarketLaunch'
  }

  export interface Web3 extends BaseMsgInstantSpotMarketLaunch {
    '@type': '/injective.exchange.v1beta1.MsgInstantSpotMarketLaunch'
  }

  export type Proto = BaseMsgInstantSpotMarketLaunch
}

const createMessage = (params: MsgInstantSpotMarketLaunch.Params) => {
  const message = BaseMsgInstantSpotMarketLaunch.create()

  message.sender = params.proposer
  message.quoteDenom = params.market.quoteDenom
  message.ticker = params.market.ticker
  message.baseDenom = params.market.baseDenom
  message.minPriceTickSize = params.market.minPriceTickSize
  message.minQuantityTickSize = params.market.minQuantityTickSize

  return BaseMsgInstantSpotMarketLaunch.fromPartial(message)
}

/**
 * @category Messages
 */
export default class MsgInstantSpotMarketLaunch extends MsgBase<
  MsgInstantSpotMarketLaunch.Params,
  MsgInstantSpotMarketLaunch.Data,
  MsgInstantSpotMarketLaunch.Proto,
  MsgInstantSpotMarketLaunch.Amino,
  MsgInstantSpotMarketLaunch.DirectSign
> {
  static fromJSON(
    params: MsgInstantSpotMarketLaunch.Params,
  ): MsgInstantSpotMarketLaunch {
    return new MsgInstantSpotMarketLaunch(params)
  }

  public toProto(): MsgInstantSpotMarketLaunch.Proto {
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
      },
    } as MsgInstantSpotMarketLaunch.Params

    return createMessage(params)
  }

  public toData(): MsgInstantSpotMarketLaunch.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgInstantSpotMarketLaunch',
      ...proto,
    }
  }

  public toAmino(): MsgInstantSpotMarketLaunch.Amino {
    const { params } = this
    const proto = createMessage(params)

    return {
      type: 'exchange/MsgInstantSpotMarketLaunch',
      ...proto,
    }
  }

  public toWeb3(): MsgInstantSpotMarketLaunch.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgInstantSpotMarketLaunch',
      ...rest,
    } as unknown as MsgInstantSpotMarketLaunch.Web3
  }

  public toDirectSign(): MsgInstantSpotMarketLaunch.DirectSign {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgInstantSpotMarketLaunch',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return BaseMsgInstantSpotMarketLaunch.encode(this.toProto()).finish()
  }
}
