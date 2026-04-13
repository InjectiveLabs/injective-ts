import { toChainFormat } from '@injectivelabs/utils'
import * as InjectiveExchangeV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/tx_pb'
import * as InjectiveOracleV1Beta1OraclePb from '@injectivelabs/core-proto-ts-v2/generated/injective/oracle/v1beta1/oracle_pb'
import { MsgBase } from '../../MsgBase.js'
import { numberToCosmosSdkDecString } from '../../../../utils/numbers.js'

export declare namespace MsgInstantBinaryOptionsMarketLaunch {
  export interface Params {
    proposer: string
    market: {
      ticker: string
      admin: string
      oracleSymbol: string
      oracleProvider: string
      oracleScaleFactor: number
      oracleType: InjectiveOracleV1Beta1OraclePb.OracleType
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
    InjectiveExchangeV1Beta1TxPb.MsgInstantBinaryOptionsMarketLaunch
}

const createMessage = (params: MsgInstantBinaryOptionsMarketLaunch.Params) => {
  const message =
    InjectiveExchangeV1Beta1TxPb.MsgInstantBinaryOptionsMarketLaunch.create({
      sender: params.proposer,
      ticker: params.market.ticker,
      oracleSymbol: params.market.oracleSymbol,
      oracleProvider: params.market.oracleProvider,
      oracleType: params.market.oracleType,
      oracleScaleFactor: params.market.oracleScaleFactor,
      makerFeeRate: params.market.makerFeeRate,
      takerFeeRate: params.market.takerFeeRate,
      expirationTimestamp: BigInt(params.market.expirationTimestamp),
      settlementTimestamp: BigInt(params.market.settlementTimestamp),
      admin: params.market.admin,
      quoteDenom: params.market.quoteDenom,
      minPriceTickSize: params.market.minPriceTickSize,
      minQuantityTickSize: params.market.minQuantityTickSize,
      minNotional: params.market.minNotional,
    })

  return message
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
        minPriceTickSize: toChainFormat(
          initialParams.market.minPriceTickSize,
        ).toFixed(),
        makerFeeRate: toChainFormat(
          initialParams.market.makerFeeRate,
        ).toFixed(),
        takerFeeRate: toChainFormat(
          initialParams.market.takerFeeRate,
        ).toFixed(),
        minQuantityTickSize: toChainFormat(
          initialParams.market.minQuantityTickSize,
        ).toFixed(),
        minNotional: toChainFormat(initialParams.market.minNotional).toFixed(),
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
    const message = {
      sender: params.proposer,
      ticker: params.market.ticker,
      oracle_symbol: params.market.oracleSymbol,
      oracle_provider: params.market.oracleProvider,
      oracle_type: params.market.oracleType,
      oracle_scale_factor: params.market.oracleScaleFactor,
      maker_fee_rate: params.market.makerFeeRate,
      taker_fee_rate: params.market.takerFeeRate,
      expiration_timestamp: params.market.expirationTimestamp.toString(),
      settlement_timestamp: params.market.settlementTimestamp.toString(),
      admin: params.market.admin,
      quote_denom: params.market.quoteDenom,
      min_price_tick_size: params.market.minPriceTickSize,
      min_quantity_tick_size: params.market.minQuantityTickSize,
      min_notional: params.market.minNotional,
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

  public toEip712() {
    const amino = this.toAmino()
    const { type, value } = amino

    const messageAdjusted = {
      ...value,
      min_price_tick_size: toChainFormat(value.min_price_tick_size).toFixed(),
      min_quantity_tick_size: toChainFormat(
        value.min_quantity_tick_size,
      ).toFixed(),
      min_notional: toChainFormat(value.min_notional).toFixed(),
      taker_fee_rate: toChainFormat(value.taker_fee_rate).toFixed(),
      maker_fee_rate: toChainFormat(value.maker_fee_rate).toFixed(),
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
      taker_fee_rate: numberToCosmosSdkDecString(params.market.takerFeeRate),
      maker_fee_rate: numberToCosmosSdkDecString(params.market.makerFeeRate),
      oracle_type:
        InjectiveOracleV1Beta1OraclePb.OracleType[params.market.oracleType],
    }

    return messageAdjusted
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgInstantBinaryOptionsMarketLaunch',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV1Beta1TxPb.MsgInstantBinaryOptionsMarketLaunch.toBinary(
      this.toProto(),
    )
  }
}
