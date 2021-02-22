import { TransactionOptions } from '@injectivelabs/ts-types'
import { NonPayableTx } from '@injectivelabs/web3-contract-typings/types/types'

export const getTransactionOptionsAsNonPayableTx = (
  transactionOptions: TransactionOptions,
): Partial<NonPayableTx> => ({
  from: transactionOptions.from,
  to: transactionOptions.to,
  gas: transactionOptions.gas?.toString(),
  gasPrice: transactionOptions.gasPrice
    ? transactionOptions.gasPrice.toString()
    : 0,
})
