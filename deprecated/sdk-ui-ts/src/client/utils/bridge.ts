import { convertTimestampToMilliseconds } from '@injectivelabs/utils'
import { BridgeTransactionState, UiBridgeTransaction } from '../../types'

const sameTxHash = (txHashOne: string, txHashTwo: string) =>
  txHashOne &&
  txHashTwo &&
  txHashOne.replace('0x', '').toLowerCase() ===
    txHashTwo.replace('0x', '').toLowerCase()

export const getCachedIBCTransactionState = (
  transaction: UiBridgeTransaction,
): BridgeTransactionState => {
  if (
    transaction.timeoutTimestamp &&
    transaction.state === BridgeTransactionState.Submitted
  ) {
    const now = Date.now()
    const bufferTime = 60 * 1000 // hardcode to 1 minute
    const timeoutTimestampWithBuffer =
      convertTimestampToMilliseconds(
        parseInt(transaction.timeoutTimestamp, 10),
      ) + bufferTime

    if (now >= timeoutTimestampWithBuffer) {
      return BridgeTransactionState.Failed
    }

    return BridgeTransactionState.Submitted
  }

  return transaction.state as BridgeTransactionState
}

export const findEthereumTransactionByNonce = (
  transaction: UiBridgeTransaction,
  comparingTransaction: UiBridgeTransaction,
) =>
  transaction.nonce &&
  comparingTransaction.nonce &&
  transaction.nonce === comparingTransaction.nonce

export const findEthereumTransactionByTxHash = (
  transaction: UiBridgeTransaction,
  comparingTransaction: UiBridgeTransaction,
) =>
  transaction.txHash &&
  comparingTransaction.txHash &&
  sameTxHash(transaction.txHash, comparingTransaction.txHash)

export const findEthereumTransactionByTxHashes = (
  transaction: UiBridgeTransaction,
  comparingTransaction: UiBridgeTransaction,
) =>
  transaction.txHashes &&
  transaction.txHashes.find((hash: string) =>
    sameTxHash(hash, comparingTransaction.txHash),
  ) !== undefined

export const findIBCTransactionByTimeoutTimestamp = (
  transaction: UiBridgeTransaction,
  comparingTransaction: UiBridgeTransaction,
) =>
  transaction.sender === comparingTransaction.sender &&
  transaction.receiver === comparingTransaction.receiver &&
  transaction.timeoutTimestamp &&
  comparingTransaction.timeoutTimestamp &&
  convertTimestampToMilliseconds(transaction.timeoutTimestamp) ===
    convertTimestampToMilliseconds(comparingTransaction.timeoutTimestamp)

export const ibcTxNotPartOfInjectiveIbcTxs =
  (injectiveIbcTransactions: UiBridgeTransaction[]) =>
  (transaction: UiBridgeTransaction) =>
    injectiveIbcTransactions.find((injectiveIbcTransaction) =>
      findIBCTransactionByTimeoutTimestamp(
        injectiveIbcTransaction,
        transaction,
      ),
    ) === undefined

export const txNotPartOfPeggoDeposit =
  (peggoDepositTxs: UiBridgeTransaction[]) =>
  (transaction: UiBridgeTransaction) =>
    peggoDepositTxs.find((peggoDepositTx) =>
      findEthereumTransactionByTxHash(peggoDepositTx, transaction),
    ) === undefined

export const txNotPartOfInjectivePeggyTxs =
  (injectivePeggyTransactions: UiBridgeTransaction[]) =>
  (transaction: UiBridgeTransaction) =>
    injectivePeggyTransactions.find(
      (injectiveTransaction) =>
        findEthereumTransactionByNonce(injectiveTransaction, transaction) ||
        findEthereumTransactionByTxHashes(injectiveTransaction, transaction) ||
        findEthereumTransactionByTxHash(injectiveTransaction, transaction),
    ) === undefined
