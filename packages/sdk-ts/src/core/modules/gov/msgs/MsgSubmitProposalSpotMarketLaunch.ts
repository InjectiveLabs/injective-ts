import { MsgSubmitProposal as BaseMsgSubmitProposal } from '@injectivelabs/core-proto-ts/cosmos/gov/v1beta1/tx'
import { Coin } from '@injectivelabs/core-proto-ts/cosmos/base/v1beta1/coin'
import { SpotMarketLaunchProposal } from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/tx'
import { Any } from '@injectivelabs/core-proto-ts/google/protobuf/any'
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

  export interface DirectSign {
    type: '/cosmos.gov.v1beta1.MsgSubmitProposal'
    message: BaseMsgSubmitProposal
  }

  export interface Data extends BaseMsgSubmitProposal {
    '@type': '/cosmos.gov.v1beta1.MsgSubmitProposal'
  }

  export interface Amino extends BaseMsgSubmitProposal {
    type: 'cosmos-sdk/MsgSubmitProposal'
  }

  export interface Web3 extends BaseMsgSubmitProposal {
    '@type': '/cosmos.authz.v1beta1.MsgSubmitProposal'
  }

  export type Proto = BaseMsgSubmitProposal
}

/**
 * @category Messages
 */
export default class MsgSubmitProposalSpotMarketLaunch extends MsgBase<
  MsgSubmitProposalSpotMarketLaunch.Params,
  MsgSubmitProposalSpotMarketLaunch.Data,
  MsgSubmitProposalSpotMarketLaunch.Proto,
  MsgSubmitProposalSpotMarketLaunch.Amino,
  MsgSubmitProposalSpotMarketLaunch.DirectSign
> {
  static fromJSON(
    params: MsgSubmitProposalSpotMarketLaunch.Params,
  ): MsgSubmitProposalSpotMarketLaunch {
    return new MsgSubmitProposalSpotMarketLaunch(params)
  }

  public toProto(): MsgSubmitProposalSpotMarketLaunch.Proto {
    const { params } = this

    const depositParams = Coin.create()
    depositParams.denom = params.deposit.denom
    depositParams.amount = params.deposit.amount

    const content = this.getContent()
    const proposalType = '/injective.exchange.v1beta1.SpotMarketLaunchProposal'

    const contentAny = Any.create()
    contentAny.value = SpotMarketLaunchProposal.encode(content).finish()
    contentAny.typeUrl = proposalType

    const message = BaseMsgSubmitProposal.create()
    message.content = contentAny
    message.proposer = params.proposer
    message.initialDeposit = [depositParams]

    return BaseMsgSubmitProposal.fromPartial(message)
  }

  public toData(): MsgSubmitProposalSpotMarketLaunch.Data {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.gov.v1beta1.MsgSubmitProposal',
      ...proto,
    }
  }

  public toAmino(): MsgSubmitProposalSpotMarketLaunch.Amino {
    const { params } = this
    const content = this.getContent()
    const proposalType = 'exchange/SpotMarketLaunchProposal'

    const message = {
      content,
      proposer: params.proposer,
    }

    const messageWithProposalType = {
      ...message,
      content: {
        ...message.content,
        type: proposalType,
      },
    }

    return {
      type: 'cosmos-sdk/MsgSubmitProposal',
      ...messageWithProposalType,
    } as unknown as MsgSubmitProposalSpotMarketLaunch.Amino
  }

  public toWeb3(): MsgSubmitProposalSpotMarketLaunch.Web3 {
    const { params } = this
    const content = this.getContent()
    const proposalType = '/injective.exchange.v1beta1.SpotMarketLaunchProposal'

    const message = {
      content,
      proposer: params.proposer,
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

  public toDirectSign(): MsgSubmitProposalSpotMarketLaunch.DirectSign {
    const proto = this.toProto()

    return {
      type: '/cosmos.gov.v1beta1.MsgSubmitProposal',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return BaseMsgSubmitProposal.encode(this.toProto()).finish()
  }

  private getContent() {
    const { params } = this

    const content = SpotMarketLaunchProposal.create()
    content.title = params.market.title
    content.description = params.market.description
    content.quoteDenom = params.market.quoteDenom
    content.ticker = params.market.ticker
    content.baseDenom = params.market.baseDenom
    content.minPriceTickSize = params.market.minPriceTickSize
    content.minQuantityTickSize = params.market.minQuantityTickSize
    content.makerFeeRate = params.market.makerFeeRate
    content.takerFeeRate = params.market.makerFeeRate

    return SpotMarketLaunchProposal.fromPartial(content)
  }
}
