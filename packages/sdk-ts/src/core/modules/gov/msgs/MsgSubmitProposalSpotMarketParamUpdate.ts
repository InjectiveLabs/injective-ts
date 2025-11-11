import { toChainFormat } from '@injectivelabs/utils'
import * as GoogleProtobufAnyPb from '@injectivelabs/core-proto-ts-v2/generated/google/protobuf/any_pb.mjs'
import * as CosmosGovV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/gov/v1beta1/tx_pb.mjs'
import * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb.mjs'
import * as InjectiveExchangeV1Beta1ProposalPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/proposal_pb.mjs'
import * as InjectiveExchangeV1Beta1ExchangePb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/exchange_pb.mjs'
import { MsgBase } from '../../MsgBase.js'
import { numberToCosmosSdkDecString } from '../../../../utils/numbers.js'
import type { SnakeCaseKeys } from 'snakecase-keys'

const createSpotMarketParamUpdate = (
  params: MsgSubmitProposalSpotMarketParamUpdate.Params,
) => {
  const content: any = {
    title: params.market.title,
    description: params.market.description,
    marketId: params.market.marketId,
    makerFeeRate: params.market.makerFeeRate,
    takerFeeRate: params.market.takerFeeRate,
    relayerFeeShareRate: params.market.relayerFeeShareRate,
    minPriceTickSize: params.market.minPriceTickSize,
    minQuantityTickSize: params.market.minQuantityTickSize,
    status: params.market.status,
    ticker: params.market.ticker,
    baseDecimals: params.market.baseDecimals,
    quoteDecimals: params.market.quoteDecimals,
    minNotional: params.market.minNotional,
  }

  if (params.market.adminInfo) {
    content.adminInfo = {
      admin: params.market.adminInfo.admin,
      adminPermissions: params.market.adminInfo.adminPermissions,
    }
  }

  return InjectiveExchangeV1Beta1ProposalPb.SpotMarketParamUpdateProposal.create(
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
      status: InjectiveExchangeV1Beta1ExchangePb.MarketStatus
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
        relayerFeeShareRate: toChainFormat(
          initialParams.market.relayerFeeShareRate,
        ).toFixed(),
        makerFeeRate: toChainFormat(
          initialParams.market.makerFeeRate,
        ).toFixed(),
        takerFeeRate: toChainFormat(
          initialParams.market.takerFeeRate,
        ).toFixed(),
        minPriceTickSize: toChainFormat(
          initialParams.market.minPriceTickSize,
        ).toFixed(),
        minNotional: toChainFormat(initialParams.market.minNotional).toFixed(),
        minQuantityTickSize: toChainFormat(
          initialParams.market.minQuantityTickSize,
        ).toFixed(),
      },
    }

    const depositParams = CosmosBaseV1Beta1CoinPb.Coin.create({
      denom: params.deposit.denom,
      amount: params.deposit.amount,
    })

    const contentAny = GoogleProtobufAnyPb.Any.create({
      typeUrl: '/injective.exchange.v1beta1.SpotMarketParamUpdateProposal',
      value:
        InjectiveExchangeV1Beta1ProposalPb.SpotMarketParamUpdateProposal.toBinary(
          createSpotMarketParamUpdate(params),
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

    const content = createSpotMarketParamUpdate(params)
    const messageWithProposalType = {
      content: {
        type: 'exchange/SpotMarketParamUpdateProposal',
        value: {
          title: content.title,
          description: content.description,
          market_id: content.marketId,
          maker_fee_rate: content.makerFeeRate,
          taker_fee_rate: content.takerFeeRate,
          relayer_fee_share_rate: content.relayerFeeShareRate,
          min_price_tick_size: content.minPriceTickSize,
          min_quantity_tick_size: content.minQuantityTickSize,
          status: content.status,
          ticker: content.ticker,
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

    // Convert admin_info to use snake_case for adminPermissions
    const adminInfo = value.content.value.admin_info
      ? {
          admin: value.content.value.admin_info.admin,
          admin_permissions: value.content.value.admin_info.adminPermissions,
        }
      : null

    const messageAdjusted = {
      ...value,
      content: {
        type: 'exchange/SpotMarketParamUpdateProposal',
        value: {
          ...value.content.value,
          admin_info: adminInfo,
          relayer_fee_share_rate: toChainFormat(
            params.market.relayerFeeShareRate,
          ).toFixed(),
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
        messageAdjusted as unknown as SnakeCaseKeys<MsgSubmitProposalSpotMarketParamUpdate.Object>,
    }
  }

  public toEip712V2() {
    const { params } = this
    const web3gw = this.toWeb3Gw()
    const content = web3gw.content as unknown as any

    // Convert admin_info to use snake_case for adminPermissions
    const adminInfo = content.admin_info
      ? {
          admin: content.admin_info.admin,
          admin_permissions: content.admin_info.adminPermissions,
        }
      : null

    const messageAdjusted = {
      ...web3gw,
      content: {
        ...content,
        status: InjectiveExchangeV1Beta1ExchangePb.MarketStatus[content.status],
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
        admin_info: adminInfo,
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
