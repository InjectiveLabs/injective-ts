import { MsgInstantSpotMarketLaunch as BaseMsgInstantSpotMarketLaunch } from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import { amountToCosmosSdkDecAmount } from '../../../../utils/numbers'
import { MsgBase } from '../../MsgBase'
import snakecaseKeys from 'snakecase-keys'

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

  export type Proto = BaseMsgInstantSpotMarketLaunch

  export type Object = BaseMsgInstantSpotMarketLaunch.AsObject
}

const createMessage = (params: MsgInstantSpotMarketLaunch.Params) => {
  const message = new BaseMsgInstantSpotMarketLaunch()

  message.setSender(params.proposer)
  message.setQuoteDenom(params.market.quoteDenom)
  message.setTicker(params.market.ticker)
  message.setBaseDenom(params.market.baseDenom)
  message.setMinPriceTickSize(params.market.minPriceTickSize)
  message.setMinQuantityTickSize(params.market.minQuantityTickSize)

  return message
}

/**
 * @category Messages
 */
export default class MsgInstantSpotMarketLaunch extends MsgBase<
  MsgInstantSpotMarketLaunch.Params,
  MsgInstantSpotMarketLaunch.Proto,
  MsgInstantSpotMarketLaunch.Object
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
      },
    } as MsgInstantSpotMarketLaunch.Params

    return createMessage(params)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgInstantSpotMarketLaunch',
      ...proto.toObject(),
    }
  }

  public toAmino() {
    const { params } = this
    const proto = createMessage(params)
    const message = {
      ...snakecaseKeys(proto.toObject()),
    }

    return {
      type: 'exchange/MsgInstantSpotMarketLaunch',
      value: message,
    }
  }

  public toWeb3() {
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
}
