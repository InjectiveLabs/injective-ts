import { MsgInstantSpotMarketLaunch as BaseMsgInstantSpotMarketLaunch } from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
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

  export interface Data extends BaseMsgInstantSpotMarketLaunch.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgInstantSpotMarketLaunch'
  }

  export interface Web3 extends BaseMsgInstantSpotMarketLaunch.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgInstantSpotMarketLaunch'
  }

  export type Proto = BaseMsgInstantSpotMarketLaunch
}

export default class MsgInstantSpotMarketLaunch extends MsgBase<
  MsgInstantSpotMarketLaunch.Params,
  MsgInstantSpotMarketLaunch.Data,
  MsgInstantSpotMarketLaunch.Proto,
  MsgInstantSpotMarketLaunch.Web3,
  MsgInstantSpotMarketLaunch.DirectSign
> {
  static fromJSON(
    params: MsgInstantSpotMarketLaunch.Params,
  ): MsgInstantSpotMarketLaunch {
    return new MsgInstantSpotMarketLaunch(params)
  }

  toProto(): MsgInstantSpotMarketLaunch.Proto {
    const { params } = this
    const message = new BaseMsgInstantSpotMarketLaunch()

    message.setSender(params.proposer)
    message.setQuoteDenom(params.market.quoteDenom)
    message.setTicker(params.market.ticker)
    message.setBaseDenom(params.market.baseDenom)
    message.setMinPriceTickSize(params.market.minPriceTickSize)
    message.setMinQuantityTickSize(params.market.minQuantityTickSize)
    return message
  }

  toData(): MsgInstantSpotMarketLaunch.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgInstantSpotMarketLaunch',
      ...proto.toObject(),
    }
  }

  toWeb3(): MsgInstantSpotMarketLaunch.Web3 {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgInstantSpotMarketLaunch',
      ...proto.toObject(),
    }
  }

  toDirectSign(): MsgInstantSpotMarketLaunch.DirectSign {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgInstantSpotMarketLaunch',
      message: proto,
    }
  }
}
