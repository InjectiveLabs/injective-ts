import { IndexerErrorModule } from '@injectivelabs/exceptions'

export * from './mito.js'
export type * from './swap.js'
export type * from './spot.js'
export type * from './oracle.js'
export * from './account.js'
export type * from './auction.js'
export * from './trading.js'
export type * from './archiver.js'
export type * from './exchange.js'
export * from './explorer.js'
export type * from './referral.js'
export type * from './campaign.js'
export type * from './spot-rest.js'
export type * from './mega-vault.js'
export type * from './incentives.js'
export type * from './derivatives.js'
export type * from './explorer-rest.js'
export * from './insurance-funds.js'
export type * from './derivatives-rest.js'
export type * from './leaderboard-rest.js'
export type * from './account-portfolio.js'
export type * from './markets-history-rest.js'

export interface StreamStatusResponse {
  details: string
  code: number
  metadata: any
}

export const IndexerModule = { ...IndexerErrorModule }
