import { BlockStream, BlockStreamCallback } from './Streams/BlockStream'
import {
  BlockWithTxsStream,
  BlockWithTxsStreamCallback,
} from './Streams/BlockWithTxsStream'
import {
  TransactionStream,
  TransactionStreamCallback,
} from './Streams/TransactionStream'
import BaseConsumer from '../BaseConsumer'

export enum ExplorerStreamType {
  Blocks = 'blocks',
  Transactions = 'transactions',
}

export class ExplorerStream extends BaseConsumer {
  blocks: BlockStream

  blocksWithTxs: BlockWithTxsStream

  transactions: TransactionStream

  constructor(endpoint: string) {
    super(endpoint)

    this.blocks = new BlockStream(this.endpoint)
    this.blocksWithTxs = new BlockWithTxsStream(this.endpoint)
    this.transactions = new TransactionStream(this.endpoint)
  }
}

export {
  BlockStreamCallback,
  BlockWithTxsStreamCallback,
  TransactionStreamCallback,
}
