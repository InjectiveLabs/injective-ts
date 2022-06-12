import { Coin } from '@injectivelabs/ts-types'
import { BankBalances } from '../types'

export class UiBankTransformer {
  static bankBalancesToUiBankBalances(balances: Coin[]) {
    const bankBalances = balances
      .filter((balance) => !balance.denom.startsWith('ibc'))
      .reduce(
        (balances: BankBalances, balance: Coin) => ({
          ...balances,
          [balance.denom]: balance.amount,
        }),
        {},
      )

    const ibcBankBalances = balances
      .filter((balance) => balance.denom.startsWith('ibc'))
      .reduce(
        (balances: BankBalances, balance: Coin) => ({
          ...balances,
          [balance.denom]: balance.amount,
        }),
        {},
      )

    return {
      bankBalances,
      ibcBankBalances,
    }
  }

  static supplyToUiSupply(supply: Coin[]) {
    return {
      bankSupply: supply.filter((coin) => !coin.denom.startsWith('ibc')),
      ibcBankSupply: supply.filter((coin) => coin.denom.startsWith('ibc')),
    }
  }
}
