import { Block } from '@injectivelabs/explorer-consumer'
import {
  BlockFromExplorerApiResponse,
  BlockWithTxs,
  BaseTransaction,
  Transaction,
  TransactionFromExplorerApiResponse,
} from './types'

export const blockToBlock = (block: BlockFromExplorerApiResponse): Block => ({
  height: block.height,
  proposer: block.proposer,
  moniker: block.moniker,
  blockHash: block.block_hash,
  parentHash: block.parent_hash,
  numPreCommits: block.num_pre_commits,
  numTxs: block.num_txs,
  timestamp: block.timestamp,
})

export const blocksToBlocks = (
  blocks: BlockFromExplorerApiResponse[],
): Block[] => blocks.map(blockToBlock)

export const transactionToTransaction = (
  transaction: TransactionFromExplorerApiResponse,
): Transaction => ({
  id: transaction.id,
  blockNumber: transaction.block_number,
  blockTimestamp: transaction.block_timestamp,
  hash: transaction.hash,
  code: transaction.code,
  info: transaction.info,
  memo: transaction.memo || '',
  gasWanted: transaction.gas_wanted,
  gasFee: {
    amounts: transaction.gas_fee?.amount,
    gasLimit: transaction.gas_fee?.gas_limit,
    payer: transaction.gas_fee?.payer,
    granter: transaction.gas_fee?.granter,
  },
  gasUsed: transaction.gas_used,
  codespace: transaction.codespace,
  signatures: transaction.signatures,
  txType: transaction.tx_type,
  data: transaction.data,
  events: transaction.events || [],
  messages: (transaction.messages || []).map((message) => ({
    type: message.type,
    message: message.value,
  })),
})

export const transactionsToTransactions = (
  transactions: TransactionFromExplorerApiResponse[],
): Transaction[] => transactions.map(transactionToTransaction)

export const blockWithTxToBlockWithTx = (
  block: BlockFromExplorerApiResponse,
): BlockWithTxs => ({
  height: block.height,
  proposer: block.proposer,
  moniker: block.moniker,
  blockHash: block.block_hash,
  parentHash: block.parent_hash,
  numPreCommits: block.num_pre_commits,
  numTxs: block.num_txs,
  timestamp: block.timestamp,
  txs: block.txs ? transactionsToTransactions(block.txs) : [],
})

export const blocksWithTxsToBlocksWithTxs = (
  blocks: BlockFromExplorerApiResponse[],
): BlockWithTxs[] => blocks.map(blockWithTxToBlockWithTx)

export const baseTransactionToTransaction = (
  transaction: BaseTransaction,
): Transaction => ({
  ...transaction,
  messages: (transaction.messages || []).map((message) => ({
    type: (message as any).type,
    message: message.value,
  })),
  memo: transaction.memo || '',
})

export class NetworkTransformer {
  static blockToBlock = blockToBlock

  static blocksToBlocks = blocksToBlocks

  static transactionToTransaction = transactionToTransaction

  static transactionsToTransactions = transactionsToTransactions

  static blocksWithTxsToBlocksWithTxs = blocksWithTxsToBlocksWithTxs

  static blockWithTxToBlockWithTx = blockWithTxToBlockWithTx

  static baseTransactionToTransaction = baseTransactionToTransaction
}
