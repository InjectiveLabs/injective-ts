import snakecaseKeys, { SnakeCaseKeys } from 'snakecase-keys'
import {
  GoogleProtobufAny,
  CosmosGovV1Beta1Tx,
  CosmosBaseV1Beta1Coin,
  InjectiveExchangeV1Beta1Proposal,
} from '@injectivelabs/core-proto-ts'
import { MsgBase } from '../../MsgBase.js'
import {
  amountToCosmosSdkDecAmount,
  numberToCosmosSdkDecString,
} from '../../../../utils/numbers.js'

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
      adminInfo?: {
        admin: string
        adminPermissions: number
      }
      baseDecimals: number
      quoteDecimals: number
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
  content.takerFeeRate = params.market.takerFeeRate
  content.minNotional = params.market.minNotional
  content.baseDecimals = Number(params.market.baseDecimals)
  content.quoteDecimals = Number(params.market.quoteDecimals)

  if (params.market.adminInfo) {
    const adminInfo = InjectiveExchangeV1Beta1Proposal.AdminInfo.create()

    adminInfo.admin = params.market.adminInfo.admin
    adminInfo.adminPermissions = params.market.adminInfo.adminPermissions
    content.adminInfo = adminInfo
  }

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
    const { params: initialParams } = this

    const params = {
      ...initialParams,
      market: {
        ...initialParams.market,
        minPriceTickSize: amountToCosmosSdkDecAmount(
          initialParams.market.minPriceTickSize,
        ).toFixed(),
        minQuantityTickSize: amountToCosmosSdkDecAmount(
          initialParams.market.minQuantityTickSize,
        ).toFixed(),
        makerFeeRate: amountToCosmosSdkDecAmount(
          initialParams.market.makerFeeRate,
        ).toFixed(),
        takerFeeRate: amountToCosmosSdkDecAmount(
          initialParams.market.takerFeeRate,
        ).toFixed(),
        minNotional: amountToCosmosSdkDecAmount(
          initialParams.market.minNotional,
        ).toFixed(),
      },
    }

    const depositParams = CosmosBaseV1Beta1Coin.Coin.create()

    depositParams.denom = params.deposit.denom
    depositParams.amount = params.deposit.amount

    const contentAny = GoogleProtobufAny.Any.create()
    contentAny.typeUrl = '/injective.exchange.v1beta1.SpotMarketLaunchProposal'
    contentAny.value =
      InjectiveExchangeV1Beta1Proposal.SpotMarketLaunchProposal.encode(
        createSpotMarketLaunchContent(params),
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

    const content = createSpotMarketLaunchContent(params)

    const messageWithProposalType = snakecaseKeys({
      content: {
        type: 'exchange/SpotMarketLaunchProposal',
        value: content,
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
        messageWithProposalType as unknown as SnakeCaseKeys<MsgSubmitProposalSpotMarketLaunch.Object>,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    const messageWithProposalType = {
      ...value,
      content: {
        '@type': '/injective.exchange.v1beta1.SpotMarketLaunchProposal',
        ...value.content.value,
      },
    }

    return {
      '@type': '/cosmos.gov.v1beta1.MsgSubmitProposal',
      ...(messageWithProposalType as unknown as SnakeCaseKeys<MsgSubmitProposalSpotMarketLaunch.Object>),
    }
  }

  public toEip712() {
    const { params } = this
    const amino = this.toAmino()
    const { value, type } = amino

    const messageAdjusted = {
      ...value,
      content: {
        type: 'exchange/SpotMarketLaunchProposal',
        value: {
          ...value.content.value,
          maker_fee_rate: amountToCosmosSdkDecAmount(
            params.market.makerFeeRate,
          ).toFixed(),
          taker_fee_rate: amountToCosmosSdkDecAmount(
            params.market.takerFeeRate,
          ).toFixed(),
          min_price_tick_size: amountToCosmosSdkDecAmount(
            params.market.minPriceTickSize,
          ).toFixed(),
          min_notional: amountToCosmosSdkDecAmount(
            params.market.minNotional,
          ).toFixed(),
          min_quantity_tick_size: amountToCosmosSdkDecAmount(
            params.market.minQuantityTickSize,
          ).toFixed(),
        },
      },
    }

    return {
      type,
      value:
        messageAdjusted as unknown as SnakeCaseKeys<MsgSubmitProposalSpotMarketLaunch.Object>,
    }
  }

  public toEip712V2() {
    const { params } = this
    const web3gw = this.toWeb3Gw()
    const content = web3gw.content as unknown as any

    const messageAdjusted = {
      ...web3gw,
      content: {
        ...content,
        maker_fee_rate: numberToCosmosSdkDecString(params.market.makerFeeRate),
        taker_fee_rate: numberToCosmosSdkDecString(params.market.takerFeeRate),
        min_price_tick_size: numberToCosmosSdkDecString(
          params.market.minPriceTickSize,
        ),
        min_notional: numberToCosmosSdkDecString(params.market.minNotional),
        min_quantity_tick_size: numberToCosmosSdkDecString(
          params.market.minQuantityTickSize,
        ),
        admin_info: content.admin_info || null,
      },
    }

    return messageAdjusted
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
}
