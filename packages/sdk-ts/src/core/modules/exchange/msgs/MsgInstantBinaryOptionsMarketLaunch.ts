import { MsgInstantBinaryOptionsMarketLaunch as BaseMsgInstantBinaryOptionsMarketLaunch } from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import { amountToCosmosSdkDecAmount } from '../../../../utils/numbers'
import { OracleType } from '../../../../client'
import { MsgBase } from '../../MsgBase'
import snakecaseKeys from 'snakecase-keys'

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

  export type Proto = BaseMsgInstantBinaryOptionsMarketLaunch

  export type Object = BaseMsgInstantBinaryOptionsMarketLaunch.AsObject
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
  MsgInstantBinaryOptionsMarketLaunch.Proto,
  MsgInstantBinaryOptionsMarketLaunch.Object
> {
  static fromJSON(
    params: MsgInstantBinaryOptionsMarketLaunch.Params,
  ): MsgInstantBinaryOptionsMarketLaunch {
    return new MsgInstantBinaryOptionsMarketLaunch(params)
  }

  public toProto() {
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

  public toData() {
    const proto = this.toProto()

    return {
      '@type':
        '/injective.exchange.v1beta1.MsgInstantBinaryOptionsMarketLaunch',
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
      type: 'exchange/MsgInstantBinaryOptionsMarketLaunch',
      value: message,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type':
        '/injective.exchange.v1beta1.MsgInstantBinaryOptionsMarketLaunch',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgInstantBinaryOptionsMarketLaunch',
      message: proto,
    }
  }
}
