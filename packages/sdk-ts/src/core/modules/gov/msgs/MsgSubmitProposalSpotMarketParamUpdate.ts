import snakecaseKeys, { SnakeCaseKeys } from 'snakecase-keys'
import {
  GoogleProtobufAny,
  CosmosGovV1Beta1Tx,
  CosmosBaseV1Beta1Coin,
  InjectiveExchangeV1Beta1Tx,
  InjectiveExchangeV1Beta1Exchange,
} from '@injectivelabs/core-proto-ts'
import { MsgBase } from '../../MsgBase'
import { amountToCosmosSdkDecAmount } from '../../../../utils/numbers'

const createSpotMarketParamUpdate = (
  params: MsgSubmitProposalSpotMarketParamUpdate.Params,
) => {
  const content =
    InjectiveExchangeV1Beta1Tx.SpotMarketParamUpdateProposal.create()
  content.title = params.market.title
  content.description = params.market.description
  content.makerFeeRate = params.market.makerFeeRate
  content.takerFeeRate = params.market.takerFeeRate
  content.relayerFeeShareRate = params.market.relayerFeeShareRate
  content.marketId = params.market.marketId
  content.status = params.market.status
  content.minPriceTickSize = params.market.minPriceTickSize
  content.minQuantityTickSize = params.market.minQuantityTickSize

  return InjectiveExchangeV1Beta1Tx.SpotMarketParamUpdateProposal.fromPartial(
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
        minQuantityTickSize: amountToCosmosSdkDecAmount(
          params.market.minQuantityTickSize,
        ).toFixed(),
      },
    })

    const contentAny = GoogleProtobufAny.Any.create()
    contentAny.value =
      InjectiveExchangeV1Beta1Tx.SpotMarketParamUpdateProposal.encode(
        content,
      ).finish()
    contentAny.typeUrl =
      '/injective.exchange.v1beta1.SpotMarketParamUpdateProposal'

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
      proposer: params.proposer,
      initialDeposit: [
        {
          denom: params.deposit.denom,
          amount: params.deposit.amount,
        },
      ],
      content: {
        type_url: 'exchange/SpotMarketParamUpdateProposal',
        value: this.getContent(),
      },
    })

    return {
      type: 'cosmos-sdk/MsgSubmitProposal',
      value:
        messageWithProposalType as unknown as SnakeCaseKeys<MsgSubmitProposalSpotMarketParamUpdate.Object>,
    }
  }

  public toWeb3() {
    const { params } = this

    const messageWithProposalType = {
      proposer: params.proposer,
      initialDeposit: [
        {
          denom: params.deposit.denom,
          amount: params.deposit.amount,
        },
      ],
      content: {
        '@type': '/injective.exchange.v1beta1.SpotMarketParamUpdateProposal',
        ...this.getContent(),
      },
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
