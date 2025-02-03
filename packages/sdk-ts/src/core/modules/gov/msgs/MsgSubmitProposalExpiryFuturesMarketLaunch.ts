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

export declare namespace MsgSubmitProposalExpiryFuturesMarketLaunch {
  export interface Params {
    market: {
      title: string
      description: string
      ticker: string
      quoteDenom: string
      oracleBase: string
      oracleQuote: string
      expiry: number
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

const createExpiryFuturesMarketLaunch = (
  params: MsgSubmitProposalExpiryFuturesMarketLaunch.Params,
) => {
  const content =
    InjectiveExchangeV1Beta1Proposal.ExpiryFuturesMarketLaunchProposal.create()

  content.title = params.market.title
  content.description = params.market.description
  content.ticker = params.market.ticker
  content.quoteDenom = params.market.quoteDenom
  content.oracleBase = params.market.oracleBase
  content.oracleQuote = params.market.oracleQuote
  content.oracleScaleFactor = params.market.oracleScaleFactor
  content.oracleType = params.market.oracleType
  content.expiry = params.market.expiry.toString()
  content.initialMarginRatio = params.market.initialMarginRatio
  content.maintenanceMarginRatio = params.market.maintenanceMarginRatio
  content.makerFeeRate = params.market.makerFeeRate
  content.takerFeeRate = params.market.takerFeeRate
  content.minPriceTickSize = params.market.minPriceTickSize
  content.minQuantityTickSize = params.market.minQuantityTickSize
  content.minNotional = params.market.minNotional

  return InjectiveExchangeV1Beta1Proposal.ExpiryFuturesMarketLaunchProposal.fromPartial(
    content,
  )
}

/**
 * @category Messages
 */
export default class MsgSubmitProposalExpiryFuturesMarketLaunch extends MsgBase<
  MsgSubmitProposalExpiryFuturesMarketLaunch.Params,
  MsgSubmitProposalExpiryFuturesMarketLaunch.Proto,
  MsgSubmitProposalExpiryFuturesMarketLaunch.Object
> {
  static fromJSON(
    params: MsgSubmitProposalExpiryFuturesMarketLaunch.Params,
  ): MsgSubmitProposalExpiryFuturesMarketLaunch {
    return new MsgSubmitProposalExpiryFuturesMarketLaunch(params)
  }

  public toProto() {
    const { params } = this

    const depositParams = CosmosBaseV1Beta1Coin.Coin.create()

    depositParams.denom = params.deposit.denom
    depositParams.amount = params.deposit.amount

    const content = createExpiryFuturesMarketLaunch({
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
      '/injective.exchange.v1beta1.ExpiryFuturesMarketLaunchProposal'
    contentAny.value =
      InjectiveExchangeV1Beta1Proposal.ExpiryFuturesMarketLaunchProposal.encode(
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
        type: 'exchange/ExpiryFuturesMarketLaunchProposal',
        value: snakecaseKeys({
          ...message.content,
          oracleType: InjectiveOracleV1Beta1Oracle.oracleTypeToJSON(
            message.content.oracleType,
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
        messageWithProposalType as unknown as SnakeCaseKeys<MsgSubmitProposalExpiryFuturesMarketLaunch.Object>,
    }
  }

  public toWeb3() {
    const { params } = this

    const messageWithProposalType = {
      content: {
        '@type': '/injective.exchange.v1beta1.ExpiryFuturesMarketLaunchProposal',
        ...snakecaseKeys({
          ...this.getContent(),
          oracleType: InjectiveOracleV1Beta1Oracle.oracleTypeToJSON(
            params.market.oracleType,
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
    }

    return {
      '@type': '/cosmos.gov.v1beta1.MsgSubmitProposal',
      ...(messageWithProposalType as unknown as SnakeCaseKeys<MsgSubmitProposalExpiryFuturesMarketLaunch.Object>),
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

    return createExpiryFuturesMarketLaunch(params)
  }
}
