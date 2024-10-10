export * from './enums'
export * from './aliases'
export * from './transactions'
export * from './cosmos'
export * from './trade'
export * from './wallet/index'

export interface StreamStatusResponse {
  details: string
  code: number
  metadata: any
}

export enum StreamOperation {
  Insert = 'insert',
  Delete = 'delete',
  Replace = 'replace',
  Update = 'update',
  Invalidate = 'invalidate',
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
