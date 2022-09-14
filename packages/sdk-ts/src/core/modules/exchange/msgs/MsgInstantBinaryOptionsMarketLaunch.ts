import { MsgInstantBinaryOptionsMarketLaunch as BaseMsgInstantBinaryOptionsMarketLaunch } from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
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

  export interface Data
    extends BaseMsgInstantBinaryOptionsMarketLaunch.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgInstantBinaryOptionsMarketLaunch'
  }

  export interface Amino
    extends BaseMsgInstantBinaryOptionsMarketLaunch.AsObject {
    type: 'exchange/MsgInstantBinaryOptionsMarketLaunch'
  }

  export interface Web3
    extends BaseMsgInstantBinaryOptionsMarketLaunch.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgInstantBinaryOptionsMarketLaunch'
  }

  export type Proto = BaseMsgInstantBinaryOptionsMarketLaunch
}

const createMessage = (params: MsgInstantBinaryOptionsMarketLaunch.Params) => {
  const message = new BaseMsgInstantBinaryOptionsMarketLaunch()

  message.setSender(params.proposer)
  message.setTicker(params.market.ticker)
  message.setOracleSymbol(params.market.oracleSymbol)
  message.setOracleProvider(params.market.oracleProvider)
  message.setOracleType(params.market.oracleType)
  message.setOracleScaleFactor(params.market.oracleScaleFactor)
  message.setMakerFeeRate(params.market.makerFeeRate)
  message.setTakerFeeRate(params.market.takerFeeRate)
  message.setExpirationTimestamp(params.market.expirationTimestamp)
  message.setSettlementTimestamp(params.market.settlementTimestamp)
  message.setAdmin(params.market.admin)
  message.setQuoteDenom(params.market.quoteDenom)
  message.setMinPriceTickSize(params.market.minPriceTickSize)
  message.setMinQuantityTickSize(params.market.minQuantityTickSize)

  return message
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
    const message = new BaseMsgInstantBinaryOptionsMarketLaunch()

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

    message.setSender(params.proposer)
    message.setTicker(params.market.ticker)
    message.setOracleSymbol(params.market.oracleSymbol)
    message.setOracleProvider(params.market.oracleProvider)
    message.setOracleType(params.market.oracleType)
    message.setOracleScaleFactor(params.market.oracleScaleFactor)
    message.setMakerFeeRate(params.market.makerFeeRate)
    message.setTakerFeeRate(params.market.takerFeeRate)
    message.setExpirationTimestamp(params.market.expirationTimestamp)
    message.setSettlementTimestamp(params.market.settlementTimestamp)
    message.setAdmin(params.market.admin)
    message.setQuoteDenom(params.market.quoteDenom)
    message.setMinPriceTickSize(params.market.minPriceTickSize)
    message.setMinQuantityTickSize(params.market.minQuantityTickSize)

    return createMessage(params)
  }

  public toData(): MsgInstantBinaryOptionsMarketLaunch.Data {
    const proto = this.toProto()

    return {
      '@type':
        '/injective.exchange.v1beta1.MsgInstantBinaryOptionsMarketLaunch',
      ...proto.toObject(),
    }
  }

  public toAmino(): MsgInstantBinaryOptionsMarketLaunch.Amino {
    const { params } = this
    const proto = createMessage(params)

    return {
      type: 'exchange/MsgInstantBinaryOptionsMarketLaunch',
      ...proto.toObject(),
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
}
