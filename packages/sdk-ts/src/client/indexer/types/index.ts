import { IndexerErrorModule } from '@injectivelabs/exceptions'

export * from './mito'
export * from './swap'
export * from './spot'
export * from './oracle'
export * from './account'
export * from './auction'
export * from './trading'
export * from './archiver'
export * from './exchange'
export * from './explorer'
export * from './campaign'
export * from './spot-rest'
export * from './incentives'
export * from './derivatives'
export * from './explorer-rest'
export * from './insurance-funds'
export * from './derivatives-rest'
export * from './leaderboard-rest'
export * from './account-portfolio'
export * from './markets-history-rest'

export interface StreamStatusResponse {
  details: string
  code: number
  metadata: any
}

export const IndexerModule = { ...IndexerErrorModule }
