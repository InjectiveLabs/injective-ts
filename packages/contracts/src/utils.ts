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
