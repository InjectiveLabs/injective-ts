import { BigNumberInBase, BigNumberInWei } from '@injectivelabs/utils'
import { fetchAccounts } from './services/auth'
import { fetchSupply } from './services/bank'
import {
  fetchDerivativesMarkets,
  fetchExchangeModuleState,
  fetchPositions,
  fetchSubaccountBalances,
} from './services/exchange'
import {
  fetchPool,
  fetchValidatorDelegations,
  fetchValidators,
} from './services/staking'
import { fetchSupplyWithTokenMeta } from './services/tvl'
import { ValidatorDelegationsResponse } from './types'

export class ProtocolStats {
  private sentryHttpUrl: string

  constructor({ sentryHttpUrl }: { sentryHttpUrl: string }) {
    this.sentryHttpUrl = sentryHttpUrl
  }

  async fetchSupply(denom?: string) {
    const { sentryHttpUrl } = this
    const bankSupply = await fetchSupply(sentryHttpUrl)

    if (!denom) {
      return bankSupply.supply
    }

    const denomSupply = bankSupply.supply.find(
      (token) => token.denom.toLowerCase() === denom.toLowerCase(),
    )

    if (!denomSupply) {
      throw new Error(`Denom ${denom} supply not found!`)
    }

    return denomSupply
  }

  async fetchInjSupply() {
    const { sentryHttpUrl } = this
    const bankSupplyResponse = await fetchSupply(sentryHttpUrl)

    const denomSupply = bankSupplyResponse.supply.find(
      (token) => token.denom.toLowerCase() === 'inj'.toLowerCase(),
    )

    if (!denomSupply) {
      throw new Error(`Denom INJ supply not found!`)
    }

    return denomSupply
  }

  async fetchPool() {
    const { sentryHttpUrl } = this

    const poolResponse = await fetchPool(sentryHttpUrl)

    return poolResponse.pool
  }

  async fetchTvl() {
    const { sentryHttpUrl } = this

    const supplyWithTokenMetaAndPrice = await fetchSupplyWithTokenMeta(
      sentryHttpUrl,
    )
    const supplyWithAmountAndUsd = supplyWithTokenMetaAndPrice
      .map((token) => {
        const amount = new BigNumberInBase(
          new BigNumberInWei(token.amount).toBase(token.decimals).toFixed(4),
        )

        return {
          amount,
          asset: token.symbol,
          priceInUsd: token.priceInUsd,
          amountInUsd: amount.times(token.priceInUsd),
        }
      })
      .sort((a, b) => b.amountInUsd.minus(a.amountInUsd).toNumber())
      .map((token) => ({
        ...token,
        amount: token.amount.toFormat(),
        amountInUsd: token.amountInUsd.toFormat(),
      }))

    const tvlInUsd = supplyWithTokenMetaAndPrice.reduce(
      (total, { decimals, amount, priceInUsd }) =>
        total.plus(
          new BigNumberInWei(amount).toBase(decimals).times(priceInUsd),
        ),
      new BigNumberInBase(0),
    )

    return {
      tvlInUsd,
      supplyWithAmountAndUsd,
    }
  }

  async fetchTotalValidators(status = 'BOND_STATUS_BONDED') {
    const { sentryHttpUrl } = this

    const validatorsResponse = await fetchValidators({
      endpoint: sentryHttpUrl,
      status,
    })

    return validatorsResponse.pagination.total
  }

  async fetchTotalOpenInterest() {
    const { sentryHttpUrl } = this

    const derivativeMarketsResponse = await fetchDerivativesMarkets({
      endpoint: sentryHttpUrl,
    })
    const positionsResponse = await fetchPositions(sentryHttpUrl)
    const positions = positionsResponse.state.map((position) => {
      const market = derivativeMarketsResponse.markets.find(
        (market) => market.market.market_id === position.market_id,
      )

      return {
        ...position,
        market,
      }
    })

    const openInterestByMarket = positions.reduce(
      (openInterestByMarket, position) => {
        const { market } = position

        if (!market) {
          return openInterestByMarket
        }

        const baseToken = market.market.ticker.split('/')[0] as string
        const existingOpenInterest = openInterestByMarket[baseToken] || 0
        const openInterest = new BigNumberInBase(existingOpenInterest).plus(
          position.position.quantity,
        )

        return {
          ...openInterestByMarket,
          [baseToken]: openInterest,
        }
      },
      {} as Record<string, BigNumberInBase>,
    )

    return openInterestByMarket
  }

  async fetchTotalDelegators() {
    const { sentryHttpUrl } = this
    const validatorStatus = 'BOND_STATUS_BONDED'
    const validatorsResponse = await fetchValidators({
      endpoint: sentryHttpUrl,
      status: validatorStatus,
    })

    const delegatorsResponse = await Promise.all(
      validatorsResponse.validators.map(async (validator) =>
        fetchValidatorDelegations({
          validatorAddress: validator.operator_address,
          endpoint: sentryHttpUrl,
        }),
      ),
    )

    return delegatorsResponse.reduce(
      (total: number, delegationResponse: ValidatorDelegationsResponse) =>
        new BigNumberInBase(total)
          .plus(delegationResponse.pagination.total)
          .toNumber(),
      0,
    )
  }

  async fetchWeeklyActiveUsers() {
    const { sentryHttpUrl } = this

    const exchangeModuleStateResponse = await fetchExchangeModuleState(
      sentryHttpUrl,
    )

    return exchangeModuleStateResponse.state
      .trading_reward_campaign_account_points.length
  }

  async fetchTotalActiveSubaccounts() {
    const { sentryHttpUrl } = this

    const exchangeModuleStateResponse = await fetchExchangeModuleState(
      sentryHttpUrl,
    )

    return exchangeModuleStateResponse.state.subaccount_trade_nonces.filter(
      (nonce: any) => nonce.subaccount_trade_nonce.nonce > 0,
    ).length
  }

  async fetchTotalInjectiveChainAccounts() {
    const { sentryHttpUrl } = this

    const accountsResponse = await fetchAccounts(sentryHttpUrl)

    return accountsResponse.pagination.total
  }

  async fetchWeeklyProtocolRevenue() {
    const { sentryHttpUrl } = this

    const auctionSubaccountId =
      '0x1111111111111111111111111111111111111111111111111111111111111111'
    const subaccountBalancesResponse = await fetchSubaccountBalances({
      endpoint: sentryHttpUrl,
      subaccountId: auctionSubaccountId,
    })
    const { deposits } = subaccountBalancesResponse

    return Object.keys(deposits).reduce(
      (total: BigNumberInBase, key: string) => {
        const deposit = deposits[key]
        return total.plus(
          new BigNumberInWei(deposit.available_balance).toBase(
            6 /* USDT/USDC/UST all have 6 decimals */,
          ),
        )
      },
      new BigNumberInBase(0),
    )
  }
}
