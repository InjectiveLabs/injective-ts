import { TransactionOptions } from '@injectivelabs/ts-types'
import { DEFAULT_GAS_PRICE, TX_DEFAULTS_GAS } from '../../constants'

export const getTransactionOptions = (
  transactionOptions: Partial<TransactionOptions>,
): TransactionOptions => ({
  from: transactionOptions.from,
  gas: transactionOptions.gas ? transactionOptions.gas : TX_DEFAULTS_GAS,
  gasPrice: transactionOptions.gasPrice
    ? transactionOptions.gasPrice.toString()
    : DEFAULT_GAS_PRICE.toString(),
})

export const peggyDenomToContractAddress = (denom: string): string =>
  denom.replace('peggy', '')
