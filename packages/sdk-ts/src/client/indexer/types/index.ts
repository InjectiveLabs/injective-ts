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
