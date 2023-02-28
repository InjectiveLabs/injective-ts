import { IndexerErrorModule } from '@injectivelabs/exceptions'

export * from './account'
export * from './account-portfolio'
export * from './auction'
export * from './derivatives-rest'
export * from './derivatives'
export * from './exchange'
export * from './explorer-rest'
export * from './explorer'
export * from './insurance-funds'
export * from './leaderboard-rest'
export * from './markets-history-rest'
export * from './ninja'
export * from './oracle'
export * from './spot-rest'
export * from './spot'

export interface StreamStatusResponse {
  details: string
  code: number
  metadata: any
}

export const IndexerModule = { ...IndexerErrorModule }
