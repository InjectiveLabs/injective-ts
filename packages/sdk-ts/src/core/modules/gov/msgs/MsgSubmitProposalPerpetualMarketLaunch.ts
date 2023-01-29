import { MsgSubmitProposal as BaseMsgSubmitProposal } from '@injectivelabs/core-proto-ts/cosmos/gov/v1beta1/tx'
import { Coin } from '@injectivelabs/core-proto-ts/cosmos/base/v1beta1/coin'
import { PerpetualMarketLaunchProposal } from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/tx'
import { Any } from '@injectivelabs/core-proto-ts/google/protobuf/any'
import { OracleType } from '@injectivelabs/core-proto-ts/injective/oracle/v1beta1/oracle'
import { MsgBase } from '../../MsgBase'

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
      oracleType: OracleType
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
    '@type': '/cosmos.gov.v1beta1.MsgSubmitProposal'
  }

  export type Proto = BaseMsgSubmitProposal
}

/**
 * @category Messages
 */
export default class MsgSubmitProposalPerpetualMarketLaunch extends MsgBase<
  MsgSubmitProposalPerpetualMarketLaunch.Params,
  MsgSubmitProposalPerpetualMarketLaunch.Data,
  MsgSubmitProposalPerpetualMarketLaunch.Proto,
  MsgSubmitProposalPerpetualMarketLaunch.Amino,
  MsgSubmitProposalPerpetualMarketLaunch.DirectSign
> {
  static fromJSON(
    params: MsgSubmitProposalPerpetualMarketLaunch.Params,
  ): MsgSubmitProposalPerpetualMarketLaunch {
    return new MsgSubmitProposalPerpetualMarketLaunch(params)
  }

  public toProto(): MsgSubmitProposalPerpetualMarketLaunch.Proto {
    const { params } = this

    const depositParams = Coin.create()
    depositParams.denom = params.deposit.denom
    depositParams.amount = params.deposit.amount

    const content = this.getContent()
    const proposalType =
      '/injective.exchange.v1beta1.PerpetualMarketLaunchProposal'

    const contentAny = Any.create()
    contentAny.value = PerpetualMarketLaunchProposal.encode(content).finish()
    contentAny.typeUrl = proposalType

    const message = BaseMsgSubmitProposal.create()
    message.content = contentAny
    message.proposer = params.proposer
    message.initialDeposit = [depositParams]

    return BaseMsgSubmitProposal.fromPartial(message)
  }

  public toData(): MsgSubmitProposalPerpetualMarketLaunch.Data {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.gov.v1beta1.MsgSubmitProposal',
      ...proto,
    }
  }

  public toAmino(): MsgSubmitProposalPerpetualMarketLaunch.Amino {
    const { params } = this
    const content = this.getContent()
    const proposalType = 'exchange/PerpetualMarketLaunchProposal'

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
    } as unknown as MsgSubmitProposalPerpetualMarketLaunch.Amino
  }

  public toWeb3(): MsgSubmitProposalPerpetualMarketLaunch.Web3 {
    const { params } = this
    const content = this.getContent()
    const proposalType =
      '/injective.exchange.v1beta1.PerpetualMarketLaunchProposal'

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
    } as unknown as MsgSubmitProposalPerpetualMarketLaunch.Web3
  }

  public toDirectSign(): MsgSubmitProposalPerpetualMarketLaunch.DirectSign {
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

    const content = PerpetualMarketLaunchProposal.create()
    content.title = params.market.title
    content.description = params.market.description
    content.quoteDenom = params.market.quoteDenom
    content.ticker = params.market.ticker
    content.initialMarginRatio = params.market.initialMarginRatio
    content.maintenanceMarginRatio = params.market.maintenanceMarginRatio
    content.makerFeeRate = params.market.makerFeeRate
    content.takerFeeRate = params.market.takerFeeRate
    content.oracleBase = params.market.oracleBase
    content.oracleQuote = params.market.oracleQuote
    content.oracleScaleFactor = params.market.oracleScaleFactor
    content.oracleType = params.market.oracleType
    content.minPriceTickSize = params.market.minPriceTickSize
    content.minQuantityTickSize = params.market.minQuantityTickSize

    return PerpetualMarketLaunchProposal.fromPartial(content)
  }
}
