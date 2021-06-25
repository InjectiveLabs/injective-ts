import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import { BigNumber } from '@injectivelabs/utils'
import { AccountAddress } from '@injectivelabs/ts-types'
import {
  ExpiryFuturesMarketLaunchProposal,
  PerpetualMarketLaunchProposal,
  SpotMarketLaunchProposal,
  SpotMarketParamUpdateProposal,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import snakeCaseKeys from 'snakecase-keys'

export interface DepositProposalParams {
  amount: BigNumber
  denom: string
}

export class ExchangeProposalComposer {
  static spotMarketLaunch({
    market,
    deposit,
    proposer,
  }: {
    market: SpotMarketLaunchProposal.AsObject
    proposer: AccountAddress
    deposit: DepositProposalParams
  }) {
    const depositParams = new Coin()
    depositParams.setDenom(deposit.denom)
    depositParams.setAmount(deposit.amount.toFixed())

    const content = new SpotMarketLaunchProposal()
    content.setTitle(market.title)
    content.setDescription(market.description)
    content.setQuoteDenom(market.quoteDenom)
    content.setTicker(market.ticker)
    content.setBaseDenom(market.baseDenom)
    content.setMinPriceTickSize(market.minPriceTickSize)
    content.setMinQuantityTickSize(market.minQuantityTickSize)

    return {
      proposer,
      content: {
        '@type': '/injective.exchange.v1beta1.SpotMarketLaunchProposal',
        ...snakeCaseKeys(content.toObject()),
      },
      initial_deposit: [{ ...snakeCaseKeys(depositParams.toObject()) }],
      '@type': '/cosmos.gov.v1beta1.MsgSubmitProposal',
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
  }) {
    const depositParams = new Coin()
    depositParams.setDenom(deposit.denom)
    depositParams.setAmount(deposit.amount.toFixed())

    const content = new SpotMarketParamUpdateProposal()
    content.setTitle(market.title)
    content.setDescription(market.description)
    content.setMakerFeeRate(market.makerFeeRate)
    content.setTakerFeeRate(market.takerFeeRate)
    content.setRelayerFeeShareRate(market.relayerFeeShareRate)
    content.setMarketId(market.marketId)
    content.setMinPriceTickSize(market.minPriceTickSize)
    content.setMinQuantityTickSize(market.minQuantityTickSize)
    return {
      proposer,
      content: {
        '@type': '/injective.exchange.v1beta1.SpotMarketParamUpdateProposal',
        ...snakeCaseKeys(content.toObject()),
      },
      initial_deposit: [{ ...snakeCaseKeys(depositParams.toObject()) }],
      '@type': '/cosmos.gov.v1beta1.MsgSubmitProposal',
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
  }) {
    const depositParams = new Coin()
    depositParams.setDenom(deposit.denom)
    depositParams.setAmount(deposit.amount.toFixed())

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

    return {
      proposer,
      content: {
        '@type': '/injective.exchange.v1beta1.PerpetualMarketLaunchProposal',
        ...snakeCaseKeys(content.toObject()),
      },
      initial_deposit: [{ ...snakeCaseKeys(depositParams.toObject()) }],
      '@type': '/cosmos.gov.v1beta1.MsgSubmitProposal',
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
  }) {
    const depositParams = new Coin()
    depositParams.setDenom(deposit.denom)
    depositParams.setAmount(deposit.amount.toFixed())

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

    return {
      proposer,
      content: {
        '@type':
          '/injective.exchange.v1beta1.ExpiryFuturesMarketLaunchProposal',
        ...snakeCaseKeys(content.toObject()),
      },
      initial_deposit: [{ ...snakeCaseKeys(depositParams.toObject()) }],
      '@type': '/cosmos.gov.v1beta1.MsgSubmitProposal',
    }
  }

  static derivativeMarketUpdate() {
    //
  }

  static derivativeMarketStatusUpdate() {
    //
  }
}
