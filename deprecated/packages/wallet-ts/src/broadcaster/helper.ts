import { TransactionException } from '@injectivelabs/exceptions'

export const checkIfTxRunOutOfGas = (e: unknown) => {
  return (
    e instanceof TransactionException &&
    e.contextCode === 11 &&
    e.contextModule === 'sdk' &&
    e.originalMessage.includes('out of gas')
  )
}
