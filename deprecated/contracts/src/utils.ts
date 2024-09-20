import { TransactionOptions } from '@injectivelabs/ts-types'

export const getTransactionOptionsAsNonPayableTx = (
  transactionOptions: TransactionOptions,
): Partial<any> => ({
  from: transactionOptions.from,
  to: transactionOptions.to,
  gas: transactionOptions.gas?.toString(),
  gasPrice: transactionOptions.gasPrice
    ? transactionOptions.gasPrice.toString()
    : 0,
})

export const ALLOWANCE_DEFAULT_GAS_LIMIT = 45000
export const PEGGY_TRANSFER_DEFAULT_GAS_LIMIT = 100000
