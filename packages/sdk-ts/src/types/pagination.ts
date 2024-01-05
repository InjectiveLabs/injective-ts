export interface PaginationOption {
  key?: string
  offset?: number
  skip?: number
  limit?: number
  reverse?: boolean
  countTotal?: boolean
  endTime?: number
  startTime?: number
  fromNumber?: number
  toNumber?: number
}

export interface PagePagination {
  next: string | null
  prev: string | null
  current: string | null
}

export interface Pagination {
  next: string | null
  total: number
}

export interface ExchangePagination {
  to: number
  from: number
  total: number
}
