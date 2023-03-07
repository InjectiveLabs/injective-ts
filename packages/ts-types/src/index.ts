export * from './enums'
export * from './aliases'
export * from './transactions'
export * from './cosmos'
export * from './trade'

export interface StreamStatusResponse {
  details: string
  code: number
  metadata: any
}

export interface PaginationOption {
  key: string
  offset?: number
  skip?: number
  limit?: number
  reverse?: boolean
  countTotal?: boolean
}

export interface Constructable<T> {
  new (...args: never): T
}
