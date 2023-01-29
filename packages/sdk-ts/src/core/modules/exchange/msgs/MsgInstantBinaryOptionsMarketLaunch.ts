import { MsgInstantBinaryOptionsMarketLaunch as BaseMsgInstantBinaryOptionsMarketLaunch } from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/tx'
import { amountToCosmosSdkDecAmount } from '../../../../utils/numbers'
import { OracleType } from '../../../../client'
import { MsgBase } from '../../MsgBase'

export declare namespace MsgInstantBinaryOptionsMarketLaunch {
  export interface Params {
    proposer: string
    market: {
      ticker: string
      admin: string
      oracleSymbol: string
      oracleProvider: string
      oracleScaleFactor: number
      oracleType: OracleType
      quoteDenom: string
      makerFeeRate: string
      takerFeeRate: string
      expirationTimestamp: number
      settlementTimestamp: number
      minPriceTickSize: string
      minQuantityTickSize: string
    }
  }

  export interface DirectSign {
    type: '/injective.exchange.v1beta1.MsgInstantBinaryOptionsMarketLaunch'
    message: BaseMsgInstantBinaryOptionsMarketLaunch
  }

  export interface Data extends BaseMsgInstantBinaryOptionsMarketLaunch {
    '@type': '/injective.exchange.v1beta1.MsgInstantBinaryOptionsMarketLaunch'
  }

  export interface Amino extends BaseMsgInstantBinaryOptionsMarketLaunch {
    type: 'exchange/MsgInstantBinaryOptionsMarketLaunch'
  }

  export interface Web3 extends BaseMsgInstantBinaryOptionsMarketLaunch {
    '@type': '/injective.exchange.v1beta1.MsgInstantBinaryOptionsMarketLaunch'
  }

  export type Proto = BaseMsgInstantBinaryOptionsMarketLaunch
}

const createMessage = (params: MsgInstantBinaryOptionsMarketLaunch.Params) => {
  const message = BaseMsgInstantBinaryOptionsMarketLaunch.create()

  message.sender = params.proposer
  message.ticker = params.market.ticker
  message.oracleSymbol = params.market.oracleSymbol
  message.oracleProvider = params.market.oracleProvider
  message.oracleType = params.market.oracleType
  message.oracleScaleFactor = params.market.oracleScaleFactor
  message.makerFeeRate = params.market.makerFeeRate
  message.takerFeeRate = params.market.takerFeeRate
  message.expirationTimestamp = params.market.expirationTimestamp.toString()
  message.settlementTimestamp = params.market.settlementTimestamp.toString()
  message.admin = params.market.admin
  message.quoteDenom = params.market.quoteDenom
  message.minPriceTickSize = params.market.minPriceTickSize
  message.minQuantityTickSize = params.market.minQuantityTickSize

  return BaseMsgInstantBinaryOptionsMarketLaunch.fromPartial(message)
}

/**
 * @category Messages
 */
export default class MsgInstantBinaryOptionsMarketLaunch extends MsgBase<
  MsgInstantBinaryOptionsMarketLaunch.Params,
  MsgInstantBinaryOptionsMarketLaunch.Data,
  MsgInstantBinaryOptionsMarketLaunch.Proto,
  MsgInstantBinaryOptionsMarketLaunch.Amino,
  MsgInstantBinaryOptionsMarketLaunch.DirectSign
> {
  static fromJSON(
    params: MsgInstantBinaryOptionsMarketLaunch.Params,
  ): MsgInstantBinaryOptionsMarketLaunch {
    return new MsgInstantBinaryOptionsMarketLaunch(params)
  }

  public toProto(): MsgInstantBinaryOptionsMarketLaunch.Proto {
    const { params: initialParams } = this

    const params = {
      ...initialParams,
      market: {
        ...initialParams.market,
        minPriceTickSize: amountToCosmosSdkDecAmount(
          initialParams.market.minPriceTickSize,
        ).toFixed(),
        makerFeeRate: amountToCosmosSdkDecAmount(
          initialParams.market.makerFeeRate,
        ).toFixed(),
        takerFeeRate: amountToCosmosSdkDecAmount(
          initialParams.market.takerFeeRate,
        ).toFixed(),
        minQuantityTickSize: amountToCosmosSdkDecAmount(
          initialParams.market.minQuantityTickSize,
        ).toFixed(),
      },
    } as MsgInstantBinaryOptionsMarketLaunch.Params

    return createMessage(params)
  }

  public toData(): MsgInstantBinaryOptionsMarketLaunch.Data {
    const proto = this.toProto()

    return {
      '@type':
        '/injective.exchange.v1beta1.MsgInstantBinaryOptionsMarketLaunch',
      ...proto,
    }
  }

  public toAmino(): MsgInstantBinaryOptionsMarketLaunch.Amino {
    const { params } = this
    const proto = createMessage(params)

    return {
      type: 'exchange/MsgInstantBinaryOptionsMarketLaunch',
      ...proto,
    }
  }

  public toWeb3(): MsgInstantBinaryOptionsMarketLaunch.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type':
        '/injective.exchange.v1beta1.MsgInstantBinaryOptionsMarketLaunch',
      ...rest,
    } as unknown as MsgInstantBinaryOptionsMarketLaunch.Web3
  }

  public toDirectSign(): MsgInstantBinaryOptionsMarketLaunch.DirectSign {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgInstantBinaryOptionsMarketLaunch',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return BaseMsgInstantBinaryOptionsMarketLaunch.encode(
      this.toProto(),
    ).finish()
  }
}
