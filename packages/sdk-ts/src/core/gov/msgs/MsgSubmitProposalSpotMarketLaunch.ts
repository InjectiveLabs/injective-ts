import { MsgSubmitProposal as BaseMsgSubmitProposal } from '@injectivelabs/chain-api/cosmos/gov/v1beta1/tx_pb'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import snakeCaseKeys from 'snakecase-keys'
import { SpotMarketLaunchProposal } from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import { Any } from 'google-protobuf/google/protobuf/any_pb'
import { MsgBase } from '../../MsgBase'

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

export default class MsgSubmitProposalSpotMarketLaunch extends MsgBase<
  MsgSubmitProposalSpotMarketLaunch.Params,
  MsgSubmitProposalSpotMarketLaunch.Data,
  MsgSubmitProposalSpotMarketLaunch.Proto,
  MsgSubmitProposalSpotMarketLaunch.Web3,
  MsgSubmitProposalSpotMarketLaunch.Amino
> {
  static fromJSON(
    params: MsgSubmitProposalSpotMarketLaunch.Params,
  ): MsgSubmitProposalSpotMarketLaunch {
    return new MsgSubmitProposalSpotMarketLaunch(params)
  }

  toProto(): MsgSubmitProposalSpotMarketLaunch.Proto {
    const { params } = this

    const depositParams = new Coin()
    depositParams.setDenom(params.deposit.denom)
    depositParams.setAmount(params.deposit.amount)

    const content = this.getContent()
    const proposalType = '/injective.exchange.v1beta1.SpotMarketLaunchProposal'

    const contentAny = new Any()
    contentAny.setValue(content.serializeBinary())
    contentAny.setTypeUrl(proposalType)

    const message = new BaseMsgSubmitProposal()
    message.setContent(contentAny)
    message.setProposer(params.proposer)
    message.setInitialDepositList([depositParams])

    return message
  }

  toData(): MsgSubmitProposalSpotMarketLaunch.Data {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.gov.v1beta1.MsgSubmitProposal',
      ...proto.toObject(),
    }
  }

  toWeb3(): MsgSubmitProposalSpotMarketLaunch.Web3 {
    const { params } = this
    const content = this.getContent()
    const proposalType = '/injective.exchange.v1beta1.SpotMarketLaunchProposal'

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
    } as unknown as MsgSubmitProposalSpotMarketLaunch.Web3
  }

  toAmino(): MsgSubmitProposalSpotMarketLaunch.Amino {
    const proto = this.toProto()

    return {
      type: '/cosmos.gov.v1beta1.MsgSubmitProposal',
      message: proto,
    }
  }

  private getContent() {
    const { params } = this

    const content = new SpotMarketLaunchProposal()
    content.setTitle(params.market.title)
    content.setDescription(params.market.description)
    content.setQuoteDenom(params.market.quoteDenom)
    content.setTicker(params.market.ticker)
    content.setBaseDenom(params.market.baseDenom)
    content.setMinPriceTickSize(params.market.minPriceTickSize)
    content.setMinQuantityTickSize(params.market.minQuantityTickSize)
    content.setMakerFeeRate(params.market.makerFeeRate)
    content.setTakerFeeRate(params.market.makerFeeRate)

    return content
  }
}
