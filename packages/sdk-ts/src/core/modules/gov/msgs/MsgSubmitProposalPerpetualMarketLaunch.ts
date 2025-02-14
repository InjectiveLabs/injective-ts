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
    const { params } = this

    const depositParams = CosmosBaseV1Beta1Coin.Coin.create()

    depositParams.denom = params.deposit.denom
    depositParams.amount = params.deposit.amount

    const content = createPerpetualMarketLaunch({
      ...params,
      market: {
        ...params.market,
        initialMarginRatio: amountToCosmosSdkDecAmount(
          params.market.initialMarginRatio,
        ).toFixed(),
        maintenanceMarginRatio: amountToCosmosSdkDecAmount(
          params.market.maintenanceMarginRatio,
        ).toFixed(),
        makerFeeRate: amountToCosmosSdkDecAmount(
          params.market.makerFeeRate,
        ).toFixed(),
        takerFeeRate: amountToCosmosSdkDecAmount(
          params.market.takerFeeRate,
        ).toFixed(),
        minPriceTickSize: amountToCosmosSdkDecAmount(
          params.market.minPriceTickSize,
        ).toFixed(),
        minQuantityTickSize: amountToCosmosSdkDecAmount(
          params.market.minQuantityTickSize,
        ).toFixed(),
        minNotional: amountToCosmosSdkDecAmount(
          params.market.minNotional,
        ).toFixed(),
      },
    })

    const contentAny = GoogleProtobufAny.Any.create()

    contentAny.typeUrl =
      '/injective.exchange.v1beta1.PerpetualMarketLaunchProposal'
    contentAny.value =
      InjectiveExchangeV1Beta1Proposal.PerpetualMarketLaunchProposal.encode(
        content,
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

    const content = this.getContent()

    const message = {
      content,
      proposer: params.proposer,
    }

    const messageWithProposalType = snakecaseKeys({
      content: {
        type: 'exchange/PerpetualMarketLaunchProposal',
        value: snakecaseKeys({
          ...message.content,
          oracleScaleFactor: Number(message.content.oracleScaleFactor),
          oracleType: InjectiveOracleV1Beta1Oracle.oracleTypeToJSON(
            Number(message.content.oracleType),
          ),
          initialMarginRatio: numberToCosmosSdkDecString(
            params.market.initialMarginRatio,
          ),
          maintenanceMarginRatio: numberToCosmosSdkDecString(
            params.market.maintenanceMarginRatio,
          ),
          makerFeeRate: numberToCosmosSdkDecString(params.market.makerFeeRate),
          takerFeeRate: numberToCosmosSdkDecString(params.market.takerFeeRate),
          minPriceTickSize: numberToCosmosSdkDecString(
            params.market.minPriceTickSize,
          ),
          minQuantityTickSize: numberToCosmosSdkDecString(
            params.market.minQuantityTickSize,
          ),
          minNotional: numberToCosmosSdkDecString(params.market.minNotional),
          adminInfo: null,
        }),
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

  public toWeb3() {
    const { value } = this.toAmino()

    const messageWithProposalType = {
      content: {
        '@type': '/injective.exchange.v1beta1.PerpetualMarketLaunchProposal',
        ...value.content.value,
      },
      initial_deposit: value.initial_deposit,
      proposer: value.proposer,
    }

    return {
      '@type': '/cosmos.gov.v1beta1.MsgSubmitProposal',
      ...(messageWithProposalType as unknown as SnakeCaseKeys<MsgSubmitProposalPerpetualMarketLaunch.Object>),
    }
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

  private getContent() {
    const { params } = this

    return createPerpetualMarketLaunch(params)
  }
}
