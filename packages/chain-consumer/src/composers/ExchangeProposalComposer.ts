import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import {
  AccountAddress,
  ComposerResponse,
  Web3GatewayMessage,
} from '@injectivelabs/ts-types'
import {
  ExpiryFuturesMarketLaunchProposal,
  PerpetualMarketLaunchProposal,
  MsgInstantSpotMarketLaunch,
  SpotMarketLaunchProposal,
  SpotMarketParamUpdateProposal,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import snakeCaseKeys from 'snakecase-keys'
import { MsgSubmitProposal } from '@injectivelabs/chain-api/cosmos/gov/v1beta1/tx_pb'
import { Any } from 'google-protobuf/google/protobuf/any_pb'
import { getWeb3GatewayMessage } from '@injectivelabs/utils'
import { DepositProposalParams } from '../types'

export class ExchangeProposalComposer {
  static instantSpotMarketLaunch({
    market,
    proposer,
  }: {
    market: MsgInstantSpotMarketLaunch.AsObject
    proposer: AccountAddress
  }): ComposerResponse<
    MsgInstantSpotMarketLaunch,
    MsgInstantSpotMarketLaunch.AsObject
  > {
    const message = new MsgInstantSpotMarketLaunch()

    message.setSender(proposer)
    message.setQuoteDenom(market.quoteDenom)
    message.setTicker(market.ticker)
    message.setBaseDenom(market.baseDenom)
    message.setMinPriceTickSize(market.minPriceTickSize)
    message.setMinQuantityTickSize(market.minQuantityTickSize)

    const type = '/injective.exchange.v1beta1.MsgInstantSpotMarketLaunch'

    return {
      web3GatewayMessage: getWeb3GatewayMessage(message.toObject(), type),
      directBroadcastMessage: {
        message,
        type,
      },
    }
  }

  static spotMarketLaunch({
    market,
    deposit,
    proposer,
  }: {
    market: SpotMarketLaunchProposal.AsObject
    proposer: AccountAddress
    deposit: DepositProposalParams
  }): ComposerResponse<MsgSubmitProposal, MsgSubmitProposal.AsObject> {
    const depositParams = new Coin()
    depositParams.setDenom(deposit.denom)
    depositParams.setAmount(deposit.amount)

    const content = new SpotMarketLaunchProposal()
    content.setTitle(market.title)
    content.setDescription(market.description)
    content.setQuoteDenom(market.quoteDenom)
    content.setTicker(market.ticker)
    content.setBaseDenom(market.baseDenom)
    content.setMinPriceTickSize(market.minPriceTickSize)
    content.setMinQuantityTickSize(market.minQuantityTickSize)
    content.setMakerFeeRate(market.makerFeeRate)
    content.setTakerFeeRate(market.makerFeeRate)

    const proposalType = '/injective.exchange.v1beta1.SpotMarketLaunchProposal'
    const type = '/cosmos.gov.v1beta1.MsgSubmitProposal'

    const contentAny = new Any()
    contentAny.setValue(content.serializeBinary())
    contentAny.setTypeUrl(proposalType)

    const message = new MsgSubmitProposal()
    message.setContent(contentAny)
    message.setProposer(proposer)
    message.setInitialDepositList([depositParams])

    const web3GatewayMessage = getWeb3GatewayMessage(
      {
        proposer,
        content: {
          ...content.toObject(),
        },
        initial_deposit: [{ ...snakeCaseKeys(depositParams.toObject()) }],
      },
      type,
    )
    const web3GatewayMessageWithProposalType = {
      ...web3GatewayMessage,
      content: {
        ...web3GatewayMessage.content,
        '@type': proposalType,
      },
    } as unknown as Web3GatewayMessage<MsgSubmitProposal.AsObject>

    return {
      web3GatewayMessage: web3GatewayMessageWithProposalType,
      directBroadcastMessage: {
        message,
        type,
      },
    }
  }

  static spotMarketUpdate({
    market,
    deposit,
    proposer,
  }: {
    market: SpotMarketParamUpdateProposal.AsObject
    proposer: AccountAddress
    deposit: DepositProposalParams
  }): ComposerResponse<MsgSubmitProposal, MsgSubmitProposal.AsObject> {
    const depositParams = new Coin()
    depositParams.setDenom(deposit.denom)
    depositParams.setAmount(deposit.amount)

    const content = new SpotMarketParamUpdateProposal()
    content.setTitle(market.title)
    content.setDescription(market.description)
    content.setMakerFeeRate(market.makerFeeRate)
    content.setTakerFeeRate(market.takerFeeRate)
    content.setRelayerFeeShareRate(market.relayerFeeShareRate)
    content.setMarketId(market.marketId)
    content.setMinPriceTickSize(market.minPriceTickSize)
    content.setMinQuantityTickSize(market.minQuantityTickSize)

    const proposalType =
      '/injective.exchange.v1beta1.SpotMarketParamUpdateProposal'
    const type = '/cosmos.gov.v1beta1.MsgSubmitProposal'

    const contentAny = new Any()
    contentAny.setValue(content.serializeBinary())
    contentAny.setTypeUrl(proposalType)

    const message = new MsgSubmitProposal()
    message.setContent(contentAny)
    message.setProposer(proposer)
    message.setInitialDepositList([depositParams])

    const web3GatewayMessage = getWeb3GatewayMessage(
      {
        proposer,
        content: {
          ...content.toObject(),
        },
        initial_deposit: [{ ...snakeCaseKeys(depositParams.toObject()) }],
      },
      type,
    )
    const web3GatewayMessageWithProposalType = {
      ...web3GatewayMessage,
      content: {
        ...web3GatewayMessage.content,
        '@type': proposalType,
      },
    } as unknown as Web3GatewayMessage<MsgSubmitProposal.AsObject>

    return {
      web3GatewayMessage: web3GatewayMessageWithProposalType,
      directBroadcastMessage: {
        message,
        type,
      },
    }
  }

  static perpetualMarketLaunch({
    market,
    deposit,
    proposer,
  }: {
    market: PerpetualMarketLaunchProposal.AsObject
    proposer: AccountAddress
    deposit: DepositProposalParams
  }): ComposerResponse<MsgSubmitProposal, MsgSubmitProposal.AsObject> {
    const depositParams = new Coin()
    depositParams.setDenom(deposit.denom)
    depositParams.setAmount(deposit.amount)

    const content = new PerpetualMarketLaunchProposal()
    content.setTitle(market.title)
    content.setDescription(market.description)
    content.setQuoteDenom(market.quoteDenom)
    content.setTicker(market.ticker)
    content.setInitialMarginRatio(market.initialMarginRatio)
    content.setMaintenanceMarginRatio(market.maintenanceMarginRatio)
    content.setMakerFeeRate(market.makerFeeRate)
    content.setTakerFeeRate(market.takerFeeRate)
    content.setOracleBase(market.oracleBase)
    content.setOracleQuote(market.oracleQuote)
    content.setOracleScaleFactor(market.oracleScaleFactor)
    content.setOracleType(market.oracleType)
    content.setMinPriceTickSize(market.minPriceTickSize)
    content.setMinQuantityTickSize(market.minQuantityTickSize)

    const proposalType =
      '/injective.exchange.v1beta1.PerpetualMarketLaunchProposal'
    const type = '/cosmos.gov.v1beta1.MsgSubmitProposal'

    const contentAny = new Any()
    contentAny.setValue(content.serializeBinary())
    contentAny.setTypeUrl(proposalType)

    const message = new MsgSubmitProposal()
    message.setContent(contentAny)
    message.setProposer(proposer)
    message.setInitialDepositList([depositParams])

    const web3GatewayMessage = getWeb3GatewayMessage(
      {
        proposer,
        content: {
          ...content.toObject(),
        },
        initial_deposit: [{ ...snakeCaseKeys(depositParams.toObject()) }],
      },
      type,
    )
    const web3GatewayMessageWithProposalType = {
      ...web3GatewayMessage,
      content: {
        ...web3GatewayMessage.content,
        '@type': proposalType,
      },
    } as unknown as Web3GatewayMessage<MsgSubmitProposal.AsObject>

    return {
      web3GatewayMessage: web3GatewayMessageWithProposalType,
      directBroadcastMessage: { message, type },
    }
  }

  static expiryFuturesMarketLaunch({
    market,
    deposit,
    proposer,
  }: {
    market: ExpiryFuturesMarketLaunchProposal.AsObject
    proposer: AccountAddress
    deposit: DepositProposalParams
  }): ComposerResponse<MsgSubmitProposal, MsgSubmitProposal.AsObject> {
    const depositParams = new Coin()
    depositParams.setDenom(deposit.denom)
    depositParams.setAmount(deposit.amount)

    const content = new ExpiryFuturesMarketLaunchProposal()
    content.setTitle(market.title)
    content.setDescription(market.description)
    content.setQuoteDenom(market.quoteDenom)
    content.setTicker(market.ticker)
    content.setInitialMarginRatio(market.initialMarginRatio)
    content.setMaintenanceMarginRatio(market.maintenanceMarginRatio)
    content.setMakerFeeRate(market.makerFeeRate)
    content.setTakerFeeRate(market.takerFeeRate)
    content.setOracleBase(market.oracleBase)
    content.setOracleQuote(market.oracleQuote)
    content.setOracleScaleFactor(market.oracleScaleFactor)
    content.setOracleType(market.oracleType)
    content.setExpiry(market.expiry)
    content.setMinPriceTickSize(market.minPriceTickSize)
    content.setMinQuantityTickSize(market.minQuantityTickSize)

    const proposalType =
      '/injective.exchange.v1beta1.ExpiryFuturesMarketLaunchProposal'
    const type = '/cosmos.gov.v1beta1.MsgSubmitProposal'

    const contentAny = new Any()
    contentAny.setValue(content.serializeBinary())
    contentAny.setTypeUrl(proposalType)

    const message = new MsgSubmitProposal()
    message.setContent(contentAny)
    message.setProposer(proposer)
    message.setInitialDepositList([depositParams])

    return {
      web3GatewayMessage: getWeb3GatewayMessage(
        {
          proposer,
          content: {
            '@type': proposalType,
            ...snakeCaseKeys(content.toObject()),
          },
          initial_deposit: [{ ...snakeCaseKeys(depositParams.toObject()) }],
        } as unknown as MsgSubmitProposal.AsObject,
        type,
      ),
      directBroadcastMessage: {
        message,
        type,
      },
    }
  }

  static derivativeMarketUpdate() {
    //
  }

  static derivativeMarketStatusUpdate() {
    //
  }
}
