import {
  TransactionException,
  ChainCosmosErrorCode,
  TransactionChainErrorModule,
} from '@injectivelabs/exceptions'

export const checkIfTxRunOutOfGas = (e: unknown) => {
  return (
    e instanceof TransactionException &&
    e.contextCode === ChainCosmosErrorCode.ErrOutOfGas &&
    e.contextModule === TransactionChainErrorModule.CosmosSdk &&
    e.originalMessage.includes('out of gas')
  )
}
