export interface PaginationOption {
  key: string
  offset?: number
  skip?: number
  limit?: number
  reverse?: boolean
  countTotal?: boolean
}

export interface Pagination {
  next: string | null
  prev: string | null
  current: string | null
}
