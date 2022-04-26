import { MsgSubmitProposal as BaseMsgSubmitProposal } from '@injectivelabs/chain-api/cosmos/gov/v1beta1/tx_pb'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import snakeCaseKeys from 'snakecase-keys'
import { SpotMarketParamUpdateProposal } from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import { Any } from 'google-protobuf/google/protobuf/any_pb'
import { MarketStatusMap } from '@injectivelabs/chain-api/injective/exchange/v1beta1/exchange_pb'
import { MsgBase } from '../../MsgBase'

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
      status: MarketStatusMap[keyof MarketStatusMap]
    }
    proposer: string
    deposit: {
      amount: string
      denom: string
    }
  }

  export interface Amino {
    type: '/cosmos.gov.v1beta1.MsgSubmitProposal'
    message: BaseMsgSubmitProposal
  }

  export interface Data extends BaseMsgSubmitProposal.AsObject {
    '@type': '/cosmos.gov.v1beta1.MsgSubmitProposal'
  }

  export interface Web3 extends BaseMsgSubmitProposal.AsObject {
    '@type': '/cosmos.gov.v1beta1.MsgSubmitProposal'
  }

  export type Proto = BaseMsgSubmitProposal
}

export default class MsgSubmitProposalSpotMarketParamUpdate extends MsgBase<
  MsgSubmitProposalSpotMarketParamUpdate.Params,
  MsgSubmitProposalSpotMarketParamUpdate.Data,
  MsgSubmitProposalSpotMarketParamUpdate.Proto,
  MsgSubmitProposalSpotMarketParamUpdate.Web3,
  MsgSubmitProposalSpotMarketParamUpdate.Amino
> {
  static fromJSON(
    params: MsgSubmitProposalSpotMarketParamUpdate.Params,
  ): MsgSubmitProposalSpotMarketParamUpdate {
    return new MsgSubmitProposalSpotMarketParamUpdate(params)
  }

  toProto(): MsgSubmitProposalSpotMarketParamUpdate.Proto {
    const { params } = this

    const depositParams = new Coin()
    depositParams.setDenom(params.deposit.denom)
    depositParams.setAmount(params.deposit.amount)

    const content = this.getContent()
    const proposalType =
      '/injective.exchange.v1beta1.SpotMarketParamUpdateProposal'

    const contentAny = new Any()
    contentAny.setValue(content.serializeBinary())
    contentAny.setTypeUrl(proposalType)

    const message = new BaseMsgSubmitProposal()
    message.setContent(contentAny)
    message.setProposer(params.proposer)
    message.setInitialDepositList([depositParams])

    return message
  }

  toData(): MsgSubmitProposalSpotMarketParamUpdate.Data {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.gov.v1beta1.MsgSubmitProposal',
      ...proto.toObject(),
    }
  }

  toWeb3(): MsgSubmitProposalSpotMarketParamUpdate.Web3 {
    const { params } = this
    const content = this.getContent()
    const proposalType =
      '/injective.exchange.v1beta1.SpotMarketParamUpdateProposal'

    const message = {
      proposer: params.proposer,
      content: {
        ...content.toObject(),
      },
      initial_deposit: [{ ...snakeCaseKeys(params.deposit) }],
    }

    const messageWithProposalType = {
      ...message,
      content: {
        ...message.content,
        '@type': proposalType,
      },
    }

    return {
      '@type': '/cosmos.gov.v1beta1.MsgSubmitProposal',
      ...messageWithProposalType,
    } as unknown as MsgSubmitProposalSpotMarketParamUpdate.Web3
  }

  toAmino(): MsgSubmitProposalSpotMarketParamUpdate.Amino {
    const proto = this.toProto()

    return {
      type: '/cosmos.gov.v1beta1.MsgSubmitProposal',
      message: proto,
    }
  }

  private getContent() {
    const { params } = this

    const content = new SpotMarketParamUpdateProposal()
    content.setTitle(params.market.title)
    content.setDescription(params.market.description)
    content.setMakerFeeRate(params.market.makerFeeRate)
    content.setTakerFeeRate(params.market.takerFeeRate)
    content.setRelayerFeeShareRate(params.market.relayerFeeShareRate)
    content.setMarketId(params.market.marketId)
    content.setStatus(params.market.status)
    content.setMinPriceTickSize(params.market.minPriceTickSize)
    content.setMinQuantityTickSize(params.market.minQuantityTickSize)

    return content
  }
}
