import { MsgSubmitProposal as BaseMsgSubmitProposal } from '@injectivelabs/chain-api/cosmos/gov/v1beta1/tx_pb'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import snakeCaseKeys from 'snakecase-keys'
import { PerpetualMarketLaunchProposal } from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import { Any } from 'google-protobuf/google/protobuf/any_pb'
import { OracleTypeMap } from '@injectivelabs/chain-api/injective/oracle/v1beta1/oracle_pb'
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
      oracleType: OracleTypeMap[keyof OracleTypeMap]
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

  export interface Data extends BaseMsgSubmitProposal.AsObject {
    '@type': '/cosmos.gov.v1beta1.MsgSubmitProposal'
  }

  export interface Amino extends BaseMsgSubmitProposal.AsObject {
    type: 'cosmos-sdk/MsgSubmitProposal'
  }

  export interface Web3 extends BaseMsgSubmitProposal.AsObject {
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

    const depositParams = new Coin()
    depositParams.setDenom(params.deposit.denom)
    depositParams.setAmount(params.deposit.amount)

    const content = this.getContent()
    const proposalType =
      '/injective.exchange.v1beta1.PerpetualMarketLaunchProposal'

    const contentAny = new Any()
    contentAny.setValue(content.serializeBinary())
    contentAny.setTypeUrl(proposalType)

    const message = new BaseMsgSubmitProposal()
    message.setContent(contentAny)
    message.setProposer(params.proposer)
    message.setInitialDepositList([depositParams])

    return message
  }

  public toData(): MsgSubmitProposalPerpetualMarketLaunch.Data {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.gov.v1beta1.MsgSubmitProposal',
      ...proto.toObject(),
    }
  }

  public toAmino(): MsgSubmitProposalPerpetualMarketLaunch.Amino {
    const { params } = this
    const proto = this.toProto()
    const content = this.getContent()
    const proposalType = 'exchange/PerpetualMarketLaunchProposal'

    const message = {
      proposer: params.proposer,
      content: {
        ...content.toObject(),
      },
      initial_deposit: proto
        .getInitialDepositList()
        .map((amount) => snakeCaseKeys(amount.toObject())),
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
    const proto = this.toProto()
    const content = this.getContent()
    const proposalType =
      '/injective.exchange.v1beta1.PerpetualMarketLaunchProposal'

    const message = {
      proposer: params.proposer,
      content: {
        ...content.toObject(),
      },
      initial_deposit: proto
        .getInitialDepositList()
        .map((amount) => snakeCaseKeys(amount.toObject())),
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

  private getContent() {
    const { params } = this

    const content = new PerpetualMarketLaunchProposal()
    content.setTitle(params.market.title)
    content.setDescription(params.market.description)
    content.setQuoteDenom(params.market.quoteDenom)
    content.setTicker(params.market.ticker)
    content.setInitialMarginRatio(params.market.initialMarginRatio)
    content.setMaintenanceMarginRatio(params.market.maintenanceMarginRatio)
    content.setMakerFeeRate(params.market.makerFeeRate)
    content.setTakerFeeRate(params.market.takerFeeRate)
    content.setOracleBase(params.market.oracleBase)
    content.setOracleQuote(params.market.oracleQuote)
    content.setOracleScaleFactor(params.market.oracleScaleFactor)
    content.setOracleType(params.market.oracleType)
    content.setMinPriceTickSize(params.market.minPriceTickSize)
    content.setMinQuantityTickSize(params.market.minQuantityTickSize)

    return content
  }
}
