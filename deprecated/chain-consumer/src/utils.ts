import { PageRequest } from '@injectivelabs/chain-api/cosmos/base/query/v1beta1/pagination_pb'
import { PaginationOption } from './types'

export const paginationRequestFromPagination = (
  pagination?: PaginationOption,
): PageRequest | undefined => {
  const paginationForRequest = new PageRequest()

  if (!pagination) {
    return
  }

  paginationForRequest.setKey(pagination.key)

  if (pagination.limit !== undefined) {
    paginationForRequest.setLimit(pagination.limit)
  }

  if (pagination.offset !== undefined) {
    paginationForRequest.setOffset(pagination.offset)
  }

  if (pagination.reverse !== undefined) {
    paginationForRequest.setReverse(pagination.reverse)
  }

  if (pagination.countTotal !== undefined) {
    paginationForRequest.setCountTotal(pagination.countTotal)
  }

  return paginationForRequest
}
