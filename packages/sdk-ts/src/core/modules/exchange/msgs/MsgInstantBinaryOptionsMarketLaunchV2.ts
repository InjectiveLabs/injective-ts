import { GeneralException } from '@injectivelabs/exceptions'
import * as InjectiveExchangeV2TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/tx_pb'
import * as InjectiveOracleV1Beta1OraclePb from '@injectivelabs/core-proto-ts-v2/generated/injective/oracle/v1beta1/oracle_pb'
import { MsgBase } from '../../MsgBase.js'
import { toOpenNotionalCap } from '../../../../utils/formatter.js'
import { numberToCosmosSdkDecString } from '../../../../utils/numbers.js'
import type * as InjectiveExchangeV2MarketPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/market_pb'

export declare namespace MsgInstantBinaryOptionsMarketLaunchV2 {
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
      openNotionalCap?: InjectiveExchangeV2MarketPb.OpenNotionalCap
    }
  }

  export type Proto =
    InjectiveExchangeV2TxPb.MsgInstantBinaryOptionsMarketLaunch
}

const createMessage = (
  params: MsgInstantBinaryOptionsMarketLaunchV2.Params,
) => {
  const message =
    InjectiveExchangeV2TxPb.MsgInstantBinaryOptionsMarketLaunch.create({
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
      ...(params.market.openNotionalCap && {
        openNotionalCap: params.market.openNotionalCap,
      }),
    })

  return message
}

/**
 * @category Messages
 */
export default class MsgInstantBinaryOptionsMarketLaunchV2 extends MsgBase<
  MsgInstantBinaryOptionsMarketLaunchV2.Params,
  MsgInstantBinaryOptionsMarketLaunchV2.Proto
> {
  static fromJSON(
    params: MsgInstantBinaryOptionsMarketLaunchV2.Params,
  ): MsgInstantBinaryOptionsMarketLaunchV2 {
    return new MsgInstantBinaryOptionsMarketLaunchV2(params)
  }

  public toProto() {
    return createMessage(this.params)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v2.MsgInstantBinaryOptionsMarketLaunch',
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
      ...(params.market.openNotionalCap && {
        open_notional_cap: toOpenNotionalCap(params.market.openNotionalCap),
      }),
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
      '@type': '/injective.exchange.v2.MsgInstantBinaryOptionsMarketLaunch',
      ...value,
    }
  }

  public toEip712(): never {
    throw new GeneralException(
      new Error(
        'EIP712 v1 is not supported for MsgInstantBinaryOptionsMarketLaunch, use toEip712V2 instead.',
      ),
    )
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
      open_notional_cap:
        toOpenNotionalCap(
          params.market.openNotionalCap,
          numberToCosmosSdkDecString,
        ) ?? {},
    }

    return messageAdjusted
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v2.MsgInstantBinaryOptionsMarketLaunch',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV2TxPb.MsgInstantBinaryOptionsMarketLaunch.toBinary(
      this.toProto(),
    )
  }
}
