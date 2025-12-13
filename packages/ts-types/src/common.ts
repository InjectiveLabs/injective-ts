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

export type UnwrappedPromise<T> = T extends Promise<infer Return> ? Return : T
