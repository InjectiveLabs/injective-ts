export * from './exchange'
export * from './derivatives'
export * from './derivatives-rest'
export * from './spot'
export * from './spot-rest'
export * from './account'
export * from './explorer'
export * from './auction'

export interface StreamStatusResponse {
  details: string
  code: number
  metadata: any
}
