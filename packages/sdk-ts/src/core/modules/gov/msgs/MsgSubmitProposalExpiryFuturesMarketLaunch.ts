import { MsgSubmitProposal as BaseMsgSubmitProposal } from '@injectivelabs/chain-api/cosmos/gov/v1beta1/tx_pb'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import { ExpiryFuturesMarketLaunchProposal } from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import { Any } from 'google-protobuf/google/protobuf/any_pb'
import { OracleTypeMap } from '@injectivelabs/chain-api/injective/oracle/v1beta1/oracle_pb'
import { MsgBase } from '../../MsgBase'
import snakecaseKeys, { SnakeCaseKeys } from 'snakecase-keys'

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

  export type Proto = BaseMsgSubmitProposal

  export type Object = BaseMsgSubmitProposal.AsObject
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

    const depositParams = new Coin()
    depositParams.setDenom(params.deposit.denom)
    depositParams.setAmount(params.deposit.amount)

    const content = this.getContent()
    const proposalType =
      '/injective.exchange.v1beta1.ExpiryFuturesMarketLaunchProposal'

    const contentAny = new Any()
    contentAny.setValue(content.serializeBinary())
    contentAny.setTypeUrl(proposalType)

    const message = new BaseMsgSubmitProposal()
    message.setContent(contentAny)
    message.setProposer(params.proposer)
    message.setInitialDepositList([depositParams])

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.gov.v1beta1.MsgSubmitProposal',
      ...proto.toObject(),
    }
  }

  public toAmino() {
    const { params } = this
    const proto = this.toProto()
    const content = this.getContent()
    const proposalType = 'exchange/ExpiryFuturesMarketLaunchProposal'

    const message = {
      proposer: params.proposer,
      content: {
        ...content.toObject(),
      },
      initial_deposit: proto
        .getInitialDepositList()
        .map((amount) => snakecaseKeys(amount.toObject())),
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
      value:
        messageWithProposalType as unknown as SnakeCaseKeys<MsgSubmitProposalExpiryFuturesMarketLaunch.Object>,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    const proposalType =
      '/injective.exchange.v1beta1.ExpiryFuturesMarketLaunchProposal'

    const messageWithProposalType = {
      ...value,
      content: {
        ...value.content,
        '@type': proposalType,
      },
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

  private getContent() {
    const { params } = this

    const content = new ExpiryFuturesMarketLaunchProposal()
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
    content.setExpiry(params.market.expiry)
    content.setMinPriceTickSize(params.market.minPriceTickSize)
    content.setMinQuantityTickSize(params.market.minQuantityTickSize)

    return content
  }
}
