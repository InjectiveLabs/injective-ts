import snakecaseKeys, { SnakeCaseKeys } from 'snakecase-keys'
import {
  GoogleProtobufAny,
  CosmosGovV1Beta1Tx,
  CosmosBaseV1Beta1Coin,
  InjectiveExchangeV1Beta1Proposal,
} from '@injectivelabs/core-proto-ts'
import { MsgBase } from '../../MsgBase'
import { amountToCosmosSdkDecAmount } from '../../../../utils/numbers'

export declare namespace MsgSubmitProposalSpotMarketLaunch {
  export interface Params {
    market: {
      title: string
      description: string
      ticker: string
      baseDenom: string
      quoteDenom: string
      minPriceTickSize: string
      minQuantityTickSize: string
      makerFeeRate: string
      takerFeeRate: string
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

const createSpotMarketLaunchContent = (
  params: MsgSubmitProposalSpotMarketLaunch.Params,
) => {
  const content =
    InjectiveExchangeV1Beta1Proposal.SpotMarketLaunchProposal.create()

  content.title = params.market.title
  content.description = params.market.description
  content.ticker = params.market.ticker
  content.baseDenom = params.market.baseDenom
  content.quoteDenom = params.market.quoteDenom
  content.minPriceTickSize = params.market.minPriceTickSize
  content.minQuantityTickSize = params.market.minQuantityTickSize
  content.makerFeeRate = params.market.makerFeeRate
  content.takerFeeRate = params.market.makerFeeRate
  content.minNotional = params.market.minNotional

  return InjectiveExchangeV1Beta1Proposal.SpotMarketLaunchProposal.fromPartial(
    content,
  )
}

/**
 * @category Messages
 */
export default class MsgSubmitProposalSpotMarketLaunch extends MsgBase<
  MsgSubmitProposalSpotMarketLaunch.Params,
  MsgSubmitProposalSpotMarketLaunch.Proto,
  MsgSubmitProposalSpotMarketLaunch.Object
> {
  static fromJSON(
    params: MsgSubmitProposalSpotMarketLaunch.Params,
  ): MsgSubmitProposalSpotMarketLaunch {
    return new MsgSubmitProposalSpotMarketLaunch(params)
  }

  public toProto(): MsgSubmitProposalSpotMarketLaunch.Proto {
    const { params } = this

    const depositParams = CosmosBaseV1Beta1Coin.Coin.create()

    depositParams.denom = params.deposit.denom
    depositParams.amount = params.deposit.amount

    const content = createSpotMarketLaunchContent({
      ...params,
      market: {
        ...params.market,
        minPriceTickSize: amountToCosmosSdkDecAmount(
          params.market.minPriceTickSize,
        ).toFixed(),
        minQuantityTickSize: amountToCosmosSdkDecAmount(
          params.market.minQuantityTickSize,
        ).toFixed(),
        makerFeeRate: amountToCosmosSdkDecAmount(
          params.market.makerFeeRate,
        ).toFixed(),
        takerFeeRate: amountToCosmosSdkDecAmount(
          params.market.makerFeeRate,
        ).toFixed(),
        minNotional: amountToCosmosSdkDecAmount(
          params.market.minNotional,
        ).toFixed(),
      },
    })
    const proposalType = '/injective.exchange.v1beta1.SpotMarketLaunchProposal'

    const contentAny = GoogleProtobufAny.Any.create()

    contentAny.typeUrl = proposalType
    contentAny.value =
      InjectiveExchangeV1Beta1Proposal.SpotMarketLaunchProposal.encode(
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
        type: 'exchange/SpotMarketLaunchProposal',
        value: message.content,
      },
      initialDeposit: [
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
        messageWithProposalType as unknown as SnakeCaseKeys<MsgSubmitProposalSpotMarketLaunch.Object>,
    }
  }

  public toWeb3() {
    const { params } = this

    const messageWithProposalType = {
      content: {
        '@type': '/injective.exchange.v1beta1.SpotMarketLaunchProposal',
        ...this.getContent(),
      },
      initialDeposit: [
        {
          denom: params.deposit.denom,
          amount: params.deposit.amount,
        },
      ],
      proposer: params.proposer,
    }

    return {
      '@type': '/cosmos.gov.v1beta1.MsgSubmitProposal',
      ...(messageWithProposalType as unknown as SnakeCaseKeys<MsgSubmitProposalSpotMarketLaunch.Object>),
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

    return createSpotMarketLaunchContent(params)
  }
}
