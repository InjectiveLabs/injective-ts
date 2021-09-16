export interface Block {
  height: number
  proposer: string
  moniker: string
  blockHash: string
  parentHash: string
  numPreCommits: number
  numTxs: number
  totalTxs: number
  timestamp: string
}

export interface TxMessage {
  key: string
  value: string
}

export interface Transaction {
  id: string
  blockNumber: number
  blockTimestamp: string
  hash: string
  code: number
  data?: Uint8Array | string
  info: string
  gasWanted: number
  gasUsed: number
  eventsList?: Array<{
    type: string
    attributesList: Array<TxMessage>
  }>
  codespace: string
  messagesList?: Array<TxMessage>
}
