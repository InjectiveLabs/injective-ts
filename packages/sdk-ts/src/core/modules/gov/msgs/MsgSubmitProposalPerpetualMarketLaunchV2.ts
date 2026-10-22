import { toChainFormat } from '@injectivelabs/utils'
import * as GoogleProtobufAnyPbPb from '@injectivelabs/core-proto-ts-v2/generated/google/protobuf/any_pb'
import * as CosmosGovV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/gov/v1beta1/tx_pb'
import * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb'
import * as InjectiveExchangeV2ProposalPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/proposal_pb'
import * as InjectiveOracleV1Beta1OraclePb from '@injectivelabs/core-proto-ts-v2/generated/injective/oracle/v1beta1/oracle_pb'
import { MsgBase } from '../../MsgBase.js'
import { validateOracleType } from '../../oracle/utils.js'
import { toAminoJson } from '../../../tx/amino/toAminoJson.js'
import { numberToCosmosSdkDecString } from '../../../../utils/numbers.js'

export declare namespace MsgSubmitProposalPerpetualMarketLaunchV2 {
  export interface Params {
    market: {
      title: string
      description: string
      ticker: string
      quoteDenom: string
      oracleBase: string
      oracleQuote: string
      oracleScaleFactor: number
      oracleType: InjectiveOracleV1Beta1OraclePb.OracleType
      initialMarginRatio: string
      maintenanceMarginRatio: string
      makerFeeRate: string
      takerFeeRate: string
      minPriceTickSize: string
      minQuantityTickSize: string
      minNotional: string
      reduceMarginRatio: string
      openNotionalCap?: string
      adminInfo?: {
        admin: string
        adminPermissions: number
      }
      crossMarginEligible: boolean
      syntheticTradeFeeRate?: string
    }
    proposer: string
    deposit: {
      amount: string
      denom: string
    }
  }

  export type Proto = CosmosGovV1Beta1TxPb.MsgSubmitProposal

  export type Object = Omit<
    CosmosGovV1Beta1TxPb.MsgSubmitProposal,
    'content'
  > & {
    content: {
      type_url: string
      value: any
    }
  }
}

const openNotionalCapValue = (value: unknown) => {
  if (value === undefined) {
    return undefined
  }

  if (typeof value !== 'string' || !/^\d+(\.\d+)?$/.test(value)) {
    throw new Error('openNotionalCap must be a non-negative decimal string')
  }

  return value
}

const toOpenNotionalCapProto = (value?: string) => ({
  cap:
    value === undefined
      ? { oneofKind: 'uncapped' as const, uncapped: {} }
      : { oneofKind: 'capped' as const, capped: { value } },
})

const toOpenNotionalCap = (
  value: unknown,
  formatValue: (value: string) => string = (value) => value,
) => {
  const cap = openNotionalCapValue(value)

  return cap === undefined
    ? { uncapped: {} }
    : { capped: { value: formatValue(cap) } }
}

const createPerpetualMarketLaunch = (
  params: MsgSubmitProposalPerpetualMarketLaunchV2.Params,
) => {
  validateOracleType(params.market.oracleType)

  const openNotionalCap = openNotionalCapValue(params.market.openNotionalCap)
  const content: any = {
    title: params.market.title,
    description: params.market.description,
    ticker: params.market.ticker,
    quoteDenom: params.market.quoteDenom,
    oracleBase: params.market.oracleBase,
    oracleQuote: params.market.oracleQuote,
    oracleScaleFactor: params.market.oracleScaleFactor,
    oracleType: params.market.oracleType,
    initialMarginRatio: params.market.initialMarginRatio,
    maintenanceMarginRatio: params.market.maintenanceMarginRatio,
    makerFeeRate: params.market.makerFeeRate,
    takerFeeRate: params.market.takerFeeRate,
    minPriceTickSize: params.market.minPriceTickSize,
    minQuantityTickSize: params.market.minQuantityTickSize,
    minNotional: params.market.minNotional,
    reduceMarginRatio: params.market.reduceMarginRatio,
    openNotionalCap: toOpenNotionalCapProto(openNotionalCap),
    crossMarginEligible: params.market.crossMarginEligible,
    ...(params.market.syntheticTradeFeeRate && {
      syntheticTradeFeeRate: params.market.syntheticTradeFeeRate,
    }),
  }

  if (params.market.adminInfo) {
    content.adminInfo = {
      admin: params.market.adminInfo.admin,
      adminPermissions: params.market.adminInfo.adminPermissions,
    }
  }

  return InjectiveExchangeV2ProposalPb.PerpetualMarketLaunchProposal.create(
    content,
  )
}

/**
 * @category Messages
 */
export default class MsgSubmitProposalPerpetualMarketLaunchV2 extends MsgBase<
  MsgSubmitProposalPerpetualMarketLaunchV2.Params,
  MsgSubmitProposalPerpetualMarketLaunchV2.Proto
> {
  static fromJSON(
    params: MsgSubmitProposalPerpetualMarketLaunchV2.Params,
  ): MsgSubmitProposalPerpetualMarketLaunchV2 {
    return new MsgSubmitProposalPerpetualMarketLaunchV2(params)
  }

  public toProto() {
    const { params: initialParams } = this
    const openNotionalCap = openNotionalCapValue(
      initialParams.market.openNotionalCap,
    )

    const params = {
      ...initialParams,
      market: {
        ...initialParams.market,
        initialMarginRatio: toChainFormat(
          initialParams.market.initialMarginRatio,
        ).toFixed(),
        maintenanceMarginRatio: toChainFormat(
          initialParams.market.maintenanceMarginRatio,
        ).toFixed(),
        makerFeeRate: toChainFormat(
          initialParams.market.makerFeeRate,
        ).toFixed(),
        minPriceTickSize: toChainFormat(
          initialParams.market.minPriceTickSize,
        ).toFixed(),
        takerFeeRate: toChainFormat(
          initialParams.market.takerFeeRate,
        ).toFixed(),
        minQuantityTickSize: toChainFormat(
          initialParams.market.minQuantityTickSize,
        ).toFixed(),
        minNotional: toChainFormat(initialParams.market.minNotional).toFixed(),
        openNotionalCap:
          openNotionalCap === undefined
            ? undefined
            : toChainFormat(openNotionalCap).toFixed(),
        reduceMarginRatio: toChainFormat(
          initialParams.market.reduceMarginRatio,
        ).toFixed(),
        syntheticTradeFeeRate: initialParams.market.syntheticTradeFeeRate
          ? toChainFormat(initialParams.market.syntheticTradeFeeRate).toFixed()
          : undefined,
      },
    }

    const depositParams = CosmosBaseV1Beta1CoinPb.Coin.create({
      denom: params.deposit.denom,
      amount: params.deposit.amount,
    })

    const contentAny = GoogleProtobufAnyPbPb.Any.create({
      typeUrl: '/injective.exchange.v2.PerpetualMarketLaunchProposal',
      value:
        InjectiveExchangeV2ProposalPb.PerpetualMarketLaunchProposal.toBinary(
          createPerpetualMarketLaunch(params),
        ),
    })

    const message = CosmosGovV1Beta1TxPb.MsgSubmitProposal.create({
      content: contentAny,
      initialDeposit: [depositParams],
      proposer: params.proposer,
    })

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.gov.v1beta1.MsgSubmitProposal',
      ...proto,
    }
  }

  public toAmino() {
    return toAminoJson(CosmosGovV1Beta1TxPb.MsgSubmitProposal, this.toProto(), {
      '/injective.exchange.v2.PerpetualMarketLaunchProposal':
        InjectiveExchangeV2ProposalPb.PerpetualMarketLaunchProposal,
    })
  }

  public toAminoRaw() {
    const { params } = this

    const content = createPerpetualMarketLaunch(params)

    const messageWithProposalType = {
      content: {
        type: 'exchange/v2/PerpetualMarketLaunchProposal',
        value: {
          title: content.title,
          description: content.description,
          ticker: content.ticker,
          quote_denom: content.quoteDenom,
          oracle_base: content.oracleBase,
          oracle_quote: content.oracleQuote,
          oracle_scale_factor: content.oracleScaleFactor,
          oracle_type: content.oracleType,
          initial_margin_ratio: content.initialMarginRatio,
          maintenance_margin_ratio: content.maintenanceMarginRatio,
          maker_fee_rate: content.makerFeeRate,
          taker_fee_rate: content.takerFeeRate,
          min_price_tick_size: content.minPriceTickSize,
          min_quantity_tick_size: content.minQuantityTickSize,
          min_notional: content.minNotional,
          admin_info: content.adminInfo || null,
          reduce_margin_ratio: content.reduceMarginRatio,
          open_notional_cap: toOpenNotionalCap(params.market.openNotionalCap),
          cross_margin_eligible: content.crossMarginEligible,
          ...(content.syntheticTradeFeeRate && {
            synthetic_trade_fee_rate: content.syntheticTradeFeeRate,
          }),
        },
      },
      initial_deposit: [
        {
          denom: params.deposit.denom,
          amount: params.deposit.amount,
        },
      ],
      proposer: params.proposer,
    }

    return {
      type: 'cosmos-sdk/MsgSubmitProposal',
      value: messageWithProposalType,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAminoRaw()
    const { value } = amino

    const messageWithProposalType = {
      ...value,
      content: {
        '@type': '/injective.exchange.v2.PerpetualMarketLaunchProposal',
        ...value.content.value,
      },
    }

    return {
      '@type': '/cosmos.gov.v1beta1.MsgSubmitProposal',
      ...messageWithProposalType,
    }
  }

  /** the chain cannot type the OpenNotionalCap oneof (no json name) for EIP712 v1 */
  public toEip712(): never {
    return this.eip712V1Unsupported('MsgSubmitProposalPerpetualMarketLaunchV2')
  }

  public toEip712V2() {
    const { params } = this
    const web3gw = this.toWeb3Gw()
    const content = web3gw.content as unknown as any

    // Convert admin_info to use snake_case for adminPermissions
    const adminInfo = content.admin_info
      ? {
          admin: content.admin_info.admin,
          admin_permissions: content.admin_info.adminPermissions,
        }
      : null

    const messageAdjusted = {
      ...web3gw,
      content: {
        ...content,
        oracle_type:
          InjectiveOracleV1Beta1OraclePb.OracleType[content.oracle_type],
        initial_margin_ratio: numberToCosmosSdkDecString(
          params.market.initialMarginRatio,
        ),
        maintenance_margin_ratio: numberToCosmosSdkDecString(
          params.market.maintenanceMarginRatio,
        ),
        maker_fee_rate: numberToCosmosSdkDecString(params.market.makerFeeRate),
        taker_fee_rate: numberToCosmosSdkDecString(params.market.takerFeeRate),
        min_price_tick_size: numberToCosmosSdkDecString(
          params.market.minPriceTickSize,
        ),
        min_notional: numberToCosmosSdkDecString(params.market.minNotional),
        min_quantity_tick_size: numberToCosmosSdkDecString(
          params.market.minQuantityTickSize,
        ),
        admin_info: adminInfo,
        reduce_margin_ratio: numberToCosmosSdkDecString(
          params.market.reduceMarginRatio,
        ),
        open_notional_cap: toOpenNotionalCap(
          params.market.openNotionalCap,
          numberToCosmosSdkDecString,
        ),
        cross_margin_eligible: params.market.crossMarginEligible,
        synthetic_trade_fee_rate: params.market.syntheticTradeFeeRate
          ? numberToCosmosSdkDecString(params.market.syntheticTradeFeeRate)
          : null,
      },
    }

    return messageAdjusted
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/cosmos.gov.v1beta1.MsgSubmitProposal',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return CosmosGovV1Beta1TxPb.MsgSubmitProposal.toBinary(this.toProto())
  }
}
