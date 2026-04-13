/**
 * @deprecated Use StreamStatusResponse from @injectivelabs/sdk-ts/types instead
 */
export interface StreamStatusResponse {
  details: string
  code: number
  metadata: any
}

/**
 * @deprecated Use StreamOperation from @injectivelabs/sdk-ts/types instead
 */
export const StreamOperation = {
  Insert: 'insert',
  Delete: 'delete',
  Replace: 'replace',
  Update: 'update',
  Invalidate: 'invalidate',
} as const

/**
 * @deprecated Use StreamOperation from @injectivelabs/sdk-ts/types instead
 */
export type StreamOperation =
  (typeof StreamOperation)[keyof typeof StreamOperation]

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
