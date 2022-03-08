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

export type Web3GatewayMessage<T> = T & { '@type': string }

export interface ComposerResponse<T, R> {
  web3GatewayMessage: Web3GatewayMessage<R> | Web3GatewayMessage<R>[]
  directBroadcastMessage:
    | { type: string; message: T }
    | { type: string; message: T }[]
}
