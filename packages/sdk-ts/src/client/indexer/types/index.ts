export * from './exchange'
export * from './derivatives'
export * from './derivatives-rest'
export * from './markets-history-rest'
export * from './spot'
export * from './spot-rest'
export * from './account'
export * from './explorer'
export * from './explorer-rest'
export * from './auction'
export * from './oracle'
export * from './insurance-funds'

export interface StreamStatusResponse {
  details: string
  code: number
  metadata: any
}

export enum IndexerModule {
  Account = 'indexer-account',
  Auction = 'indexer-auction',
  Derivatives = 'indexer-derivatives',
  Explorer = 'indexer-explorer',
  InsuranceFund = 'indexer-insurance-fund',
  Meta = 'indexer-meta',
  Oracle = 'indexer-oracle',
  Spot = 'indexer-spot',
  Transaction = 'indexer-transaction',
}
