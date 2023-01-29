import { MsgSubmitProposal as BaseMsgSubmitProposal } from '@injectivelabs/core-proto-ts/cosmos/gov/v1beta1/tx'
import { Coin } from '@injectivelabs/core-proto-ts/cosmos/base/v1beta1/coin'
import { SpotMarketParamUpdateProposal } from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/tx'
import { Any } from '@injectivelabs/core-proto-ts/google/protobuf/any'
import { MarketStatus } from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/exchange'
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
      status: MarketStatus
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
export default class MsgSubmitProposalSpotMarketParamUpdate extends MsgBase<
  MsgSubmitProposalSpotMarketParamUpdate.Params,
  MsgSubmitProposalSpotMarketParamUpdate.Data,
  MsgSubmitProposalSpotMarketParamUpdate.Proto,
  MsgSubmitProposalSpotMarketParamUpdate.Amino,
  MsgSubmitProposalSpotMarketParamUpdate.DirectSign
> {
  static fromJSON(
    params: MsgSubmitProposalSpotMarketParamUpdate.Params,
  ): MsgSubmitProposalSpotMarketParamUpdate {
    return new MsgSubmitProposalSpotMarketParamUpdate(params)
  }

  public toProto(): MsgSubmitProposalSpotMarketParamUpdate.Proto {
    const { params } = this

    const depositParams = Coin.create()
    depositParams.denom = params.deposit.denom
    depositParams.amount = params.deposit.amount

    const content = this.getContent()
    const proposalType =
      '/injective.exchange.v1beta1.SpotMarketParamUpdateProposal'

    const contentAny = Any.create()
    contentAny.value = SpotMarketParamUpdateProposal.encode(content).finish()
    contentAny.typeUrl = proposalType

    const message = BaseMsgSubmitProposal.create()
    message.content = contentAny
    message.proposer = params.proposer
    message.initialDeposit = [depositParams]

    return BaseMsgSubmitProposal.fromPartial(message)
  }

  public toData(): MsgSubmitProposalSpotMarketParamUpdate.Data {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.gov.v1beta1.MsgSubmitProposal',
      ...proto,
    }
  }

  public toAmino(): MsgSubmitProposalSpotMarketParamUpdate.Amino {
    const { params } = this
    const content = this.getContent()
    const proposalType = 'exchange/SpotMarketParamUpdateProposal'

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
    } as unknown as MsgSubmitProposalSpotMarketParamUpdate.Amino
  }

  public toWeb3(): MsgSubmitProposalSpotMarketParamUpdate.Web3 {
    const { params } = this
    const content = this.getContent()
    const proposalType =
      '/injective.exchange.v1beta1.SpotMarketParamUpdateProposal'

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
    } as unknown as MsgSubmitProposalSpotMarketParamUpdate.Web3
  }

  public toDirectSign(): MsgSubmitProposalSpotMarketParamUpdate.DirectSign {
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

    const content = SpotMarketParamUpdateProposal.create()
    content.title = params.market.title
    content.description = params.market.description
    content.makerFeeRate = params.market.makerFeeRate
    content.takerFeeRate = params.market.takerFeeRate
    content.relayerFeeShareRate = params.market.relayerFeeShareRate
    content.marketId = params.market.marketId
    content.status = params.market.status
    content.minPriceTickSize = params.market.minPriceTickSize
    content.minQuantityTickSize = params.market.minQuantityTickSize

    return SpotMarketParamUpdateProposal.fromPartial(content)
  }
}
