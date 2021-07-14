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

export interface Constructable<T> {
  new (...args: never): T
}
