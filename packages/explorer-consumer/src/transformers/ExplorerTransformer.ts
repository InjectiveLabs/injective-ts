import {
  BlockInfo,
  TxData,
} from '@injectivelabs/exchange-api/injective_explorer_rpc_pb'
import { Transaction, Block, BlockWithTxs } from '../types/index'

export class ExplorerTransformer {
  static grpcTransactionToTransaction(tx: TxData): Transaction {
    return {
      id: tx.getId(),
      blockNumber: tx.getBlockNumber(),
      blockTimestamp: tx.getBlockTimestamp(),
      hash: tx.getHash(),
      code: tx.getCode(),
      info: tx.getInfo(),
      gasWanted: tx.getGasWanted(),
      gasUsed: tx.getGasUsed(),
      codespace: tx.getCodespace(),
      data: tx.getData(),
      txType: tx.getTxType(),
      signatures: tx.getSignaturesList().map((signature) => ({
        pubkey: signature.getPubkey(),
        address: signature.getAddress(),
        sequence: signature.getSequence(),
        signature: signature.getSignature(),
      })),
      events: tx.getEventsList().map((event) => ({
        type: event.getType(),
        attributes: event
          .getAttributesMap()
          .toObject()
          .reduce(
            (
              attributes: Record<string, string>,
              attribute: [string, string],
            ) => ({ ...attributes, [attribute[0]]: attribute[1] }),
            {},
          ),
      })),
      messages: JSON.parse(tx.getMessages()),
    }
  }

  static grpcTransactionsToTransactions(
    txs: Array<TxData>,
  ): Array<Transaction> {
    return txs.map((tx) => ExplorerTransformer.grpcTransactionToTransaction(tx))
  }

  static grpcBlockToBlock(block: BlockInfo): Block {
    return {
      height: block.getHeight(),
      proposer: block.getProposer(),
      moniker: block.getMoniker(),
      blockHash: block.getBlockHash(),
      parentHash: block.getParentHash(),
      numPreCommits: block.getNumPreCommits(),
      numTxs: block.getNumTxs(),
      totalTxs: block.getTotalTxs(),
      timestamp: block.getTimestamp(),
    }
  }

  static grpcBlockToBlockWithTxs(block: BlockInfo): BlockWithTxs {
    return {
      height: block.getHeight(),
      proposer: block.getProposer(),
      moniker: block.getMoniker(),
      blockHash: block.getBlockHash(),
      parentHash: block.getParentHash(),
      numPreCommits: block.getNumPreCommits(),
      numTxs: block.getNumTxs(),
      totalTxs: block.getTotalTxs(),
      timestamp: block.getTimestamp(),
    }
  }

  static grpcBlocksToBlocks(blocks: Array<BlockInfo>): Array<Block> {
    return blocks.map((block) => ExplorerTransformer.grpcBlockToBlock(block))
  }

  static grpcBlocksToBlocksWithTxs(
    blocks: Array<BlockInfo>,
  ): Array<BlockWithTxs> {
    return blocks.map((block) =>
      ExplorerTransformer.grpcBlockToBlockWithTxs(block),
    )
  }
}
