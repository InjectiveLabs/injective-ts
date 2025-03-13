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
  content.baseDecimals = params.market.baseDecimals
  content.quoteDecimals = params.market.quoteDecimals
  content.minNotional = params.market.minNotional

  if (params.market.adminInfo) {
    const adminInfo = InjectiveExchangeV1Beta1Proposal.AdminInfo.create()
    adminInfo.admin = params.market.adminInfo.admin
    adminInfo.adminPermissions = params.market.adminInfo.adminPermissions

    content.adminInfo = adminInfo
  }

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
      baseDecimals: number
      quoteDecimals: number
      adminInfo?: {
        admin: string
        adminPermissions: number
      }
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
    const { params: initialParams } = this

    const params = {
      ...initialParams,
      market: {
        ...initialParams.market,
        relayerFeeShareRate: amountToCosmosSdkDecAmount(
          initialParams.market.relayerFeeShareRate,
        ).toFixed(),
        makerFeeRate: amountToCosmosSdkDecAmount(
          initialParams.market.makerFeeRate,
        ).toFixed(),
        takerFeeRate: amountToCosmosSdkDecAmount(
          initialParams.market.takerFeeRate,
        ).toFixed(),
        minPriceTickSize: amountToCosmosSdkDecAmount(
          initialParams.market.minPriceTickSize,
        ).toFixed(),
        minNotional: amountToCosmosSdkDecAmount(
          initialParams.market.minNotional,
        ).toFixed(),
        minQuantityTickSize: amountToCosmosSdkDecAmount(
          initialParams.market.minQuantityTickSize,
        ).toFixed(),
      },
    }

    const depositParams = CosmosBaseV1Beta1Coin.Coin.create()

    depositParams.denom = params.deposit.denom
    depositParams.amount = params.deposit.amount

    const contentAny = GoogleProtobufAny.Any.create()
    contentAny.typeUrl =
      '/injective.exchange.v1beta1.SpotMarketParamUpdateProposal'
    contentAny.value =
      InjectiveExchangeV1Beta1Proposal.SpotMarketParamUpdateProposal.encode(
        createSpotMarketParamUpdate(params),
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

    const content = createSpotMarketParamUpdate(params)
    const messageWithProposalType = snakecaseKeys({
      content: {
        type: 'exchange/SpotMarketParamUpdateProposal',
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
        messageWithProposalType as unknown as SnakeCaseKeys<MsgSubmitProposalSpotMarketParamUpdate.Object>,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    const messageWithProposalType = {
      ...value,
      content: {
        '@type': '/injective.exchange.v1beta1.SpotMarketParamUpdateProposal',
        ...value.content.value,
      },
    }

    return {
      '@type': '/cosmos.gov.v1beta1.MsgSubmitProposal',
      ...(messageWithProposalType as unknown as SnakeCaseKeys<MsgSubmitProposalSpotMarketParamUpdate.Object>),
    }
  }

  public toEip712() {
    const { params } = this
    const amino = this.toAmino()
    const { value, type } = amino

    const messageAdjusted = {
      ...value,
      content: {
        type: 'exchange/SpotMarketParamUpdateProposal',
        value: {
          ...value.content.value,
          relayer_fee_share_rate: amountToCosmosSdkDecAmount(
            params.market.relayerFeeShareRate,
          ).toFixed(),
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
        messageAdjusted as unknown as SnakeCaseKeys<MsgSubmitProposalSpotMarketParamUpdate.Object>,
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
        status: InjectiveExchangeV1Beta1Exchange.marketStatusToJSON(
          content.status,
        ),
        relayer_fee_share_rate: numberToCosmosSdkDecString(
          params.market.relayerFeeShareRate,
        ),
        maker_fee_rate: numberToCosmosSdkDecString(params.market.makerFeeRate),
        taker_fee_rate: numberToCosmosSdkDecString(params.market.takerFeeRate),
        min_price_tick_size: numberToCosmosSdkDecString(
          params.market.minPriceTickSize,
        ),
        min_notional: numberToCosmosSdkDecString(params.market.minNotional),
        min_quantity_tick_size: numberToCosmosSdkDecString(
          params.market.minQuantityTickSize,
        ),
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
