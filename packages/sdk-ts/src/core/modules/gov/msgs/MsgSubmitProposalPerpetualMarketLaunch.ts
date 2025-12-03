import snakecaseKeys from 'snakecase-keys'
import { toChainFormat } from '@injectivelabs/utils'
import * as GoogleProtobufAnyPbPb from '@injectivelabs/core-proto-ts-v2/generated/google/protobuf/any_pb'
import * as CosmosGovV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/gov/v1beta1/tx_pb'
import * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb'
import * as InjectiveOracleV1Beta1OraclePb from '@injectivelabs/core-proto-ts-v2/generated/injective/oracle/v1beta1/oracle_pb'
import * as InjectiveExchangeV1Beta1ProposalPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/proposal_pb'
import { MsgBase } from '../../MsgBase.js'
import { numberToCosmosSdkDecString } from '../../../../utils/numbers.js'
import type { SnakeCaseKeys } from 'snakecase-keys'

export declare namespace MsgSubmitProposalPerpetualMarketLaunch {
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
      adminInfo?: {
        admin: string
        adminPermissions: number
      }
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

const createPerpetualMarketLaunch = (
  params: MsgSubmitProposalPerpetualMarketLaunch.Params,
) => {
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
  }

  if (params.market.adminInfo) {
    content.adminInfo = {
      admin: params.market.adminInfo.admin,
      adminPermissions: params.market.adminInfo.adminPermissions,
    }
  }

  return InjectiveExchangeV1Beta1ProposalPb.PerpetualMarketLaunchProposal.create(
    content,
  )
}

/**
 * @category Messages
 */
export default class MsgSubmitProposalPerpetualMarketLaunch extends MsgBase<
  MsgSubmitProposalPerpetualMarketLaunch.Params,
  MsgSubmitProposalPerpetualMarketLaunch.Proto
> {
  static fromJSON(
    params: MsgSubmitProposalPerpetualMarketLaunch.Params,
  ): MsgSubmitProposalPerpetualMarketLaunch {
    return new MsgSubmitProposalPerpetualMarketLaunch(params)
  }

  public toProto() {
    const { params: initialParams } = this

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
        takerFeeRate: toChainFormat(
          initialParams.market.takerFeeRate,
        ).toFixed(),
        minQuantityTickSize: toChainFormat(
          initialParams.market.minQuantityTickSize,
        ).toFixed(),
        minNotional: toChainFormat(initialParams.market.minNotional).toFixed(),
      },
    }

    const depositParams = CosmosBaseV1Beta1CoinPb.Coin.create({
      denom: params.deposit.denom,
      amount: params.deposit.amount,
    })

    const contentAny = GoogleProtobufAnyPbPb.Any.create({
      typeUrl: '/injective.exchange.v1beta1.PerpetualMarketLaunchProposal',
      value:
        InjectiveExchangeV1Beta1ProposalPb.PerpetualMarketLaunchProposal.toBinary(
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
    const { params } = this

    const content = createPerpetualMarketLaunch(params)

    const messageWithProposalType = snakecaseKeys({
      content: {
        type: 'exchange/PerpetualMarketLaunchProposal',
        value: content,
      },
      initial_deposit: [
        {
          denom: params.deposit.denom,
          amount: params.deposit.amount,
        },
      ],
      proposer: params.proposer,
    })

    return {
      type: 'cosmos-sdk/MsgSubmitProposal',
      value:
        messageWithProposalType as unknown as SnakeCaseKeys<MsgSubmitProposalPerpetualMarketLaunch.Object>,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    const messageWithProposalType = {
      ...value,
      content: {
        '@type': '/injective.exchange.v1beta1.PerpetualMarketLaunchProposal',
        ...value.content.value,
      },
    }

    return {
      '@type': '/cosmos.gov.v1beta1.MsgSubmitProposal',
      ...(messageWithProposalType as unknown as SnakeCaseKeys<MsgSubmitProposalPerpetualMarketLaunch.Object>),
    }
  }

  public toEip712() {
    const { params } = this
    const amino = this.toAmino()
    const { value, type } = amino

    const messageAdjusted = {
      ...value,
      content: {
        type: 'exchange/PerpetualMarketLaunchProposal',
        value: {
          ...value.content.value,
          initial_margin_ratio: toChainFormat(
            params.market.initialMarginRatio,
          ).toFixed(),
          maintenance_margin_ratio: toChainFormat(
            params.market.maintenanceMarginRatio,
          ).toFixed(),
          maker_fee_rate: toChainFormat(params.market.makerFeeRate).toFixed(),
          taker_fee_rate: toChainFormat(params.market.takerFeeRate).toFixed(),
          min_price_tick_size: toChainFormat(
            params.market.minPriceTickSize,
          ).toFixed(),
          min_notional: toChainFormat(params.market.minNotional).toFixed(),
          min_quantity_tick_size: toChainFormat(
            params.market.minQuantityTickSize,
          ).toFixed(),
        },
      },
    }

    return {
      type,
      value:
        messageAdjusted as unknown as SnakeCaseKeys<MsgSubmitProposalPerpetualMarketLaunch.Object>,
    }
  }

  public toEip712V2() {
    const { params } = this
    const web3gw = this.toWeb3Gw()
    const content = web3gw.content as unknown as any

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
        admin_info: content.admin_info || null,
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
