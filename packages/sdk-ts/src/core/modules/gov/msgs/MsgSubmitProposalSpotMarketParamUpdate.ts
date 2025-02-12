import snakecaseKeys, { SnakeCaseKeys } from 'snakecase-keys'
import {
  GoogleProtobufAny,
  CosmosGovV1Beta1Tx,
  CosmosBaseV1Beta1Coin,
  InjectiveExchangeV1Beta1Proposal,
  InjectiveExchangeV1Beta1Exchange,
} from '@injectivelabs/core-proto-ts'
import { MsgBase } from '../../MsgBase.js'
import {
  amountToCosmosSdkDecAmount,
  numberToCosmosSdkDecString,
} from '../../../../utils/numbers.js'

const createSpotMarketParamUpdate = (
  params: MsgSubmitProposalSpotMarketParamUpdate.Params,
) => {
  const content =
    InjectiveExchangeV1Beta1Proposal.SpotMarketParamUpdateProposal.create()

  content.title = params.market.title
  content.description = params.market.description
  content.marketId = params.market.marketId
  content.makerFeeRate = params.market.makerFeeRate
  content.takerFeeRate = params.market.takerFeeRate
  content.relayerFeeShareRate = params.market.relayerFeeShareRate
  content.minPriceTickSize = params.market.minPriceTickSize
  content.minQuantityTickSize = params.market.minQuantityTickSize
  content.status = params.market.status
  content.ticker = params.market.ticker
  content.minNotional = params.market.minNotional

  return InjectiveExchangeV1Beta1Proposal.SpotMarketParamUpdateProposal.fromPartial(
    content,
  )
}

export declare namespace MsgSubmitProposalSpotMarketParamUpdate {
  export interface Params {
    market: {
      title: string
      description: string
      marketId: string
      makerFeeRate: string
      takerFeeRate: string
      relayerFeeShareRate: string
      minPriceTickSize: string
      minQuantityTickSize: string
      minNotional: string
      ticker: string
      adminInfo?: string
      status: InjectiveExchangeV1Beta1Exchange.MarketStatus
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
export default class MsgSubmitProposalSpotMarketParamUpdate extends MsgBase<
  MsgSubmitProposalSpotMarketParamUpdate.Params,
  MsgSubmitProposalSpotMarketParamUpdate.Proto,
  MsgSubmitProposalSpotMarketParamUpdate.Object
> {
  static fromJSON(
    params: MsgSubmitProposalSpotMarketParamUpdate.Params,
  ): MsgSubmitProposalSpotMarketParamUpdate {
    return new MsgSubmitProposalSpotMarketParamUpdate(params)
  }

  public toProto() {
    const { params } = this

    const depositParams = CosmosBaseV1Beta1Coin.Coin.create()

    depositParams.denom = params.deposit.denom
    depositParams.amount = params.deposit.amount

    const content = createSpotMarketParamUpdate({
      ...params,
      market: {
        ...params.market,
        relayerFeeShareRate: amountToCosmosSdkDecAmount(
          params.market.relayerFeeShareRate,
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
        minNotional: amountToCosmosSdkDecAmount(
          params.market.minNotional,
        ).toFixed(),
        minQuantityTickSize: amountToCosmosSdkDecAmount(
          params.market.minQuantityTickSize,
        ).toFixed(),
      },
    })

    const contentAny = GoogleProtobufAny.Any.create()

    contentAny.typeUrl =
      '/injective.exchange.v1beta1.SpotMarketParamUpdateProposal'
    contentAny.value =
      InjectiveExchangeV1Beta1Proposal.SpotMarketParamUpdateProposal.encode(
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

    const messageWithProposalType = snakecaseKeys({
      content: {
        type: 'exchange/SpotMarketParamUpdateProposal',
        value: snakecaseKeys({
          ...this.getContent(),
          status: InjectiveExchangeV1Beta1Exchange.marketStatusToJSON(
            params.market.status,
          ),
          minPriceTickSize: numberToCosmosSdkDecString(
            params.market.minPriceTickSize,
          ),
          minQuantityTickSize: numberToCosmosSdkDecString(
            params.market.minQuantityTickSize,
          ),
          relayerFeeShareRate: numberToCosmosSdkDecString(
            params.market.relayerFeeShareRate,
          ),
          makerFeeRate: numberToCosmosSdkDecString(params.market.makerFeeRate),
          takerFeeRate: numberToCosmosSdkDecString(params.market.takerFeeRate),
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
        messageWithProposalType as unknown as SnakeCaseKeys<MsgSubmitProposalSpotMarketParamUpdate.Object>,
    }
  }

  public toWeb3Gw() {
    const { params } = this

    const messageWithProposalType = {
      content: {
        '@type': '/injective.exchange.v1beta1.SpotMarketParamUpdateProposal',
        ...snakecaseKeys({
          ...this.getContent(),
          status: InjectiveExchangeV1Beta1Exchange.marketStatusToJSON(
            params.market.status,
          ),
          minPriceTickSize: numberToCosmosSdkDecString(
            params.market.minPriceTickSize,
          ),
          minQuantityTickSize: numberToCosmosSdkDecString(
            params.market.minQuantityTickSize,
          ),
          minNotional: numberToCosmosSdkDecString(params.market.minNotional),
          makerFeeRate: numberToCosmosSdkDecString(params.market.makerFeeRate),
          takerFeeRate: numberToCosmosSdkDecString(params.market.takerFeeRate),
          relayerFeeShareRate: numberToCosmosSdkDecString(
            params.market.relayerFeeShareRate,
          ),
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
      ...(messageWithProposalType as unknown as SnakeCaseKeys<MsgSubmitProposalSpotMarketParamUpdate.Object>),
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

    return createSpotMarketParamUpdate(params)
  }
}
