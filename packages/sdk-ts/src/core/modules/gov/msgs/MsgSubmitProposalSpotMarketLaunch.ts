import { toChainFormat } from '@injectivelabs/utils'
import * as GoogleProtobufAnyPbPb from '@injectivelabs/core-proto-ts-v2/generated/google/protobuf/any_pb'
import * as CosmosGovV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/gov/v1beta1/tx_pb'
import * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb'
import * as InjectiveExchangeV1Beta1ProposalPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/proposal_pb'
import { MsgBase } from '../../MsgBase.js'
import { numberToCosmosSdkDecString } from '../../../../utils/numbers.js'
import type snakecaseKeys from 'snakecase-keys'

type SnakeCaseKeys<T extends Record<string, any> | readonly any[]> =
  snakecaseKeys.SnakeCaseKeys<T>

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

  export type Proto = CosmosGovV1Beta1TxPb.MsgSubmitProposal

  export type Object = Omit<
    CosmosGovV1Beta1TxPb.MsgSubmitProposal,
    'content'
  > & {
    content: {
      type_url: string
      value: any
    }
  }
}

const createSpotMarketLaunchContent = (
  params: MsgSubmitProposalSpotMarketLaunch.Params,
) => {
  const content: any = {
    title: params.market.title,
    description: params.market.description,
    ticker: params.market.ticker,
    baseDenom: params.market.baseDenom,
    quoteDenom: params.market.quoteDenom,
    minPriceTickSize: params.market.minPriceTickSize,
    minQuantityTickSize: params.market.minQuantityTickSize,
    makerFeeRate: params.market.makerFeeRate,
    takerFeeRate: params.market.takerFeeRate,
    minNotional: params.market.minNotional,
    baseDecimals: Number(params.market.baseDecimals),
    quoteDecimals: Number(params.market.quoteDecimals),
  }

  if (params.market.adminInfo) {
    content.adminInfo = {
      admin: params.market.adminInfo.admin,
      adminPermissions: params.market.adminInfo.adminPermissions,
    }
  }

  return InjectiveExchangeV1Beta1ProposalPb.SpotMarketLaunchProposal.create(
    content,
  )
}

/**
 * @category Messages
 */
export default class MsgSubmitProposalSpotMarketLaunch extends MsgBase<
  MsgSubmitProposalSpotMarketLaunch.Params,
  MsgSubmitProposalSpotMarketLaunch.Proto
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
        minPriceTickSize: toChainFormat(
          initialParams.market.minPriceTickSize,
        ).toFixed(),
        minQuantityTickSize: toChainFormat(
          initialParams.market.minQuantityTickSize,
        ).toFixed(),
        makerFeeRate: toChainFormat(
          initialParams.market.makerFeeRate,
        ).toFixed(),
        takerFeeRate: toChainFormat(
          initialParams.market.takerFeeRate,
        ).toFixed(),
        minNotional: toChainFormat(initialParams.market.minNotional).toFixed(),
      },
    }

    const depositParams = CosmosBaseV1Beta1CoinPb.Coin.create({
      denom: params.deposit.denom,
      amount: params.deposit.amount,
    })

    const contentAny = GoogleProtobufAnyPbPb.Any.create({
      typeUrl: '/injective.exchange.v1beta1.SpotMarketLaunchProposal',
      value:
        InjectiveExchangeV1Beta1ProposalPb.SpotMarketLaunchProposal.toBinary(
          createSpotMarketLaunchContent(params),
        ),
    })

    const message = CosmosGovV1Beta1TxPb.MsgSubmitProposal.create({
      content: contentAny,
      initialDeposit: [depositParams],
      proposer: params.proposer,
    })

    return message
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

    const messageWithProposalType = {
      content: {
        type: 'exchange/SpotMarketLaunchProposal',
        value: {
          title: content.title,
          description: content.description,
          ticker: content.ticker,
          base_denom: content.baseDenom,
          quote_denom: content.quoteDenom,
          min_price_tick_size: content.minPriceTickSize,
          min_quantity_tick_size: content.minQuantityTickSize,
          maker_fee_rate: content.makerFeeRate,
          taker_fee_rate: content.takerFeeRate,
          min_notional: content.minNotional,
          admin_info: content.adminInfo || null,
          base_decimals: content.baseDecimals,
          quote_decimals: content.quoteDecimals,
        },
      },
      initial_deposit: [
        {
          denom: params.deposit.denom,
          amount: params.deposit.amount,
        },
      ],
      proposer: params.proposer,
    }

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
          maker_fee_rate: toChainFormat(params.market.makerFeeRate).toFixed(),
          taker_fee_rate: toChainFormat(params.market.takerFeeRate).toFixed(),
          min_price_tick_size: toChainFormat(
            params.market.minPriceTickSize,
          ).toFixed(),
          min_notional: toChainFormat(params.market.minNotional).toFixed(),
          min_quantity_tick_size: toChainFormat(
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
    return CosmosGovV1Beta1TxPb.MsgSubmitProposal.toBinary(this.toProto())
  }
}
