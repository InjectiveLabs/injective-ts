import {
  GoogleProtobufAny,
  CosmosGovV1Beta1Tx,
  CosmosBaseV1Beta1Coin,
  InjectiveExchangeV1Beta1Proposal,
  InjectiveOracleV1Beta1Oracle,
} from '@injectivelabs/core-proto-ts'
import snakecaseKeys, { SnakeCaseKeys } from 'snakecase-keys'
import { MsgBase } from '../../MsgBase.js'
import {
  amountToCosmosSdkDecAmount,
  numberToCosmosSdkDecString,
} from '../../../../utils/numbers.js'

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
      oracleType: InjectiveOracleV1Beta1Oracle.OracleType
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

  export type Proto = CosmosGovV1Beta1Tx.MsgSubmitProposal

  export type Object = Omit<CosmosGovV1Beta1Tx.MsgSubmitProposal, 'content'> & {
    content: {
      type_url: string
      value: any
    }
  }
}

const createPerpetualMarketLaunch = (
  params: MsgSubmitProposalPerpetualMarketLaunch.Params,
) => {
  const content =
    InjectiveExchangeV1Beta1Proposal.PerpetualMarketLaunchProposal.create()

  content.title = params.market.title
  content.description = params.market.description
  content.ticker = params.market.ticker
  content.quoteDenom = params.market.quoteDenom
  content.oracleBase = params.market.oracleBase
  content.oracleQuote = params.market.oracleQuote
  content.oracleScaleFactor = params.market.oracleScaleFactor
  content.oracleType = params.market.oracleType
  content.initialMarginRatio = params.market.initialMarginRatio
  content.maintenanceMarginRatio = params.market.maintenanceMarginRatio
  content.makerFeeRate = params.market.makerFeeRate
  content.takerFeeRate = params.market.takerFeeRate
  content.minPriceTickSize = params.market.minPriceTickSize
  content.minQuantityTickSize = params.market.minQuantityTickSize
  content.minNotional = params.market.minNotional

  if (params.market.adminInfo) {
    const adminInfo = InjectiveExchangeV1Beta1Proposal.AdminInfo.create()

    adminInfo.admin = params.market.adminInfo.admin
    adminInfo.adminPermissions = params.market.adminInfo.adminPermissions
    content.adminInfo = adminInfo
  }

  return InjectiveExchangeV1Beta1Proposal.PerpetualMarketLaunchProposal.fromPartial(
    content,
  )
}

/**
 * @category Messages
 */
export default class MsgSubmitProposalPerpetualMarketLaunch extends MsgBase<
  MsgSubmitProposalPerpetualMarketLaunch.Params,
  MsgSubmitProposalPerpetualMarketLaunch.Proto,
  MsgSubmitProposalPerpetualMarketLaunch.Object
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
        initialMarginRatio: amountToCosmosSdkDecAmount(
          initialParams.market.initialMarginRatio,
        ).toFixed(),
        maintenanceMarginRatio: amountToCosmosSdkDecAmount(
          initialParams.market.maintenanceMarginRatio,
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
    }

    const depositParams = CosmosBaseV1Beta1Coin.Coin.create()

    depositParams.denom = params.deposit.denom
    depositParams.amount = params.deposit.amount

    const contentAny = GoogleProtobufAny.Any.create()
    contentAny.typeUrl =
      '/injective.exchange.v1beta1.PerpetualMarketLaunchProposal'
    contentAny.value =
      InjectiveExchangeV1Beta1Proposal.PerpetualMarketLaunchProposal.encode(
        createPerpetualMarketLaunch(params),
      ).finish()

    const message = CosmosGovV1Beta1Tx.MsgSubmitProposal.create()

    message.content = contentAny
    message.initialDeposit = [depositParams]
    message.proposer = params.proposer

    return CosmosGovV1Beta1Tx.MsgSubmitProposal.fromPartial(message)
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

  public toEip712V2() {
    const { params } = this
    const web3gw = this.toWeb3Gw()
    const content = web3gw.content as unknown as any

    const messageAdjusted = {
      ...web3gw,
      content: {
        ...content,
        oracle_type: InjectiveOracleV1Beta1Oracle.oracleTypeToJSON(
          content.oracle_type,
        ),
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
    return CosmosGovV1Beta1Tx.MsgSubmitProposal.encode(this.toProto()).finish()
  }
}
