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
  events?: Array<{
    type: string
    attributes: Record<string, string>
  }>
  txType: string
  signatures: Array<{
    pubkey: string
    address: string
    sequence: number
    signature: string
  }>
  codespace: string
  messages?: Array<TxMessage>
}

export interface Block {
  height: number
  proposer: string
  moniker: string
  blockHash: string
  parentHash: string
  numPreCommits: number
  numTxs: number
  timestamp: string
}

export interface BlockWithTxs {
  height: number
  proposer: string
  moniker: string
  blockHash: string
  parentHash: string
  numPreCommits: number
  numTxs: number
  txs?: Transaction[]
  timestamp: string
}
