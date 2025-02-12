import { amountToCosmosSdkDecAmount } from '../../../../utils/numbers.js'
import { MsgBase } from '../../MsgBase.js'
import snakecaseKeys from 'snakecase-keys'
import {
  InjectiveExchangeV1Beta1Tx,
  InjectiveOracleV1Beta1Oracle,
} from '@injectivelabs/core-proto-ts'

export declare namespace MsgInstantBinaryOptionsMarketLaunch {
  export interface Params {
    proposer: string
    market: {
      ticker: string
      admin: string
      oracleSymbol: string
      oracleProvider: string
      oracleScaleFactor: number
      oracleType: InjectiveOracleV1Beta1Oracle.OracleType
      quoteDenom: string
      makerFeeRate: string
      takerFeeRate: string
      expirationTimestamp: number
      settlementTimestamp: number
      minPriceTickSize: string
      minQuantityTickSize: string
      minNotional: string
    }
  }

  export type Proto =
    InjectiveExchangeV1Beta1Tx.MsgInstantBinaryOptionsMarketLaunch
}

const createMessage = (params: MsgInstantBinaryOptionsMarketLaunch.Params) => {
  const message =
    InjectiveExchangeV1Beta1Tx.MsgInstantBinaryOptionsMarketLaunch.create()

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
  message.minNotional = params.market.minNotional

  return InjectiveExchangeV1Beta1Tx.MsgInstantBinaryOptionsMarketLaunch.fromPartial(
    message,
  )
}

/**
 * @category Messages
 */
export default class MsgInstantBinaryOptionsMarketLaunch extends MsgBase<
  MsgInstantBinaryOptionsMarketLaunch.Params,
  MsgInstantBinaryOptionsMarketLaunch.Proto
> {
  static fromJSON(
    params: MsgInstantBinaryOptionsMarketLaunch.Params,
  ): MsgInstantBinaryOptionsMarketLaunch {
    return new MsgInstantBinaryOptionsMarketLaunch(params)
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
        makerFeeRate: amountToCosmosSdkDecAmount(
          initialParams.market.makerFeeRate,
        ).toFixed(),
        takerFeeRate: amountToCosmosSdkDecAmount(
          initialParams.market.takerFeeRate,
        ).toFixed(),
        minQuantityTickSize: amountToCosmosSdkDecAmount(
          initialParams.market.minQuantityTickSize,
        ).toFixed(),
        minNotional: amountToCosmosSdkDecAmount(
          initialParams.market.minNotional,
        ).toFixed(),
      },
    } as MsgInstantBinaryOptionsMarketLaunch.Params

    return createMessage(params)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type':
        '/injective.exchange.v1beta1.MsgInstantBinaryOptionsMarketLaunch',
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
      type: 'exchange/MsgInstantBinaryOptionsMarketLaunch',
      value: message,
    }
  }

  public toWeb3Gw() {
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

  public toBinary(): Uint8Array {
    return InjectiveExchangeV1Beta1Tx.MsgInstantBinaryOptionsMarketLaunch.encode(
      this.toProto(),
    ).finish()
  }
}
