import { IndexerErrorModule } from '@injectivelabs/exceptions'

export * from './mito.js'
export * from './swap.js'
export * from './spot.js'
export * from './oracle.js'
export * from './account.js'
export * from './auction.js'
export * from './trading.js'
export * from './archiver.js'
export * from './exchange.js'
export * from './explorer.js'
export * from './campaign.js'
export * from './spot-rest.js'
export * from './incentives.js'
export * from './derivatives.js'
export * from './explorer-rest.js'
export * from './insurance-funds.js'
export * from './derivatives-rest.js'
export * from './leaderboard-rest.js'
export * from './account-portfolio.js'
export * from './markets-history-rest.js'

export interface StreamStatusResponse {
  details: string
  code: number
  metadata: any
}

export const IndexerModule = { ...IndexerErrorModule }
