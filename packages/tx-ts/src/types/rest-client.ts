/* eslint-disable camelcase */
export type APIParams = Record<string, string | number | null | undefined>

export interface Pagination {
  next_key: string | null
  total: number
}

export interface PaginationOptions {
  'pagination.limit': string
  'pagination.offset': string
  'pagination.key': string
  'pagination.count_total': 'true' | 'false'
  'pagination.reverse': 'true' | 'false'
  order_by: string
}

export interface TxSearchOptions extends PaginationOptions {
  events: { key: string; value: string }[]
}
