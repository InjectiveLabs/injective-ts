import snakecaseKeys, { SnakeCaseKeys } from 'snakecase-keys'
import {
  GoogleProtobufAny,
  CosmosGovV1Beta1Tx,
  CosmosBaseV1Beta1Coin,
  InjectiveExchangeV1Beta1Proposal,
  InjectiveOracleV1Beta1Oracle,
} from '@injectivelabs/core-proto-ts'
import { MsgBase } from '../../MsgBase.js'
import { amountToCosmosSdkDecAmount } from '../../../../utils/numbers.js'

const createProposalExpiryFuturesMarketLaunch = (
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

  return InjectiveExchangeV1Beta1Proposal.ExpiryFuturesMarketLaunchProposal.fromPartial(
    content,
  )
}

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

    const content = createProposalExpiryFuturesMarketLaunch({
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
    message.proposer = params.proposer
    message.initialDeposit = [depositParams]

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

    const messageWithProposalType = snakecaseKeys({
      content: {
        type: 'exchange/ExpiryFuturesMarketLaunchProposal',
        value: this.getContent(),
      },
      proposer: params.proposer,
      initialDeposit: [
        {
          denom: params.deposit.denom,
          amount: params.deposit.amount,
        },
      ],
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
        '@type':
          '/injective.exchange.v1beta1.ExpiryFuturesMarketLaunchProposal',
        ...this.getContent(),
      },
      proposer: params.proposer,
      initialDeposit: [
        {
          denom: params.deposit.denom,
          amount: params.deposit.amount,
        },
      ],
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

    return createProposalExpiryFuturesMarketLaunch(params)
  }
}
