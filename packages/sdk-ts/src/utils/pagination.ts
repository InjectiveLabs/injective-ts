import { PageRequest } from '@injectivelabs/chain-api/cosmos/base/query/v1beta1/pagination_pb'
import { PaginationOption } from '../types/pagination'
import { Pagination } from '../types/pagination'
import { PageResponse } from '@injectivelabs/chain-api/cosmos/base/query/v1beta1/pagination_pb'

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

export const generatePagination = (pagination: Pagination | undefined) => {
  if (!pagination) {
    return
  }

  if (!pagination.next) {
    return
  }

  return {
    pagination: {
      key: pagination.next,
    },
  }
}

export const paginationUint8ArrayToString = (key: any) => {
  if (key.constructor !== Uint8Array) {
    return key as string
  }

  return new TextDecoder().decode(key)
}

export const pageResponseToPagination = ({
  newPagination,
  oldPagination,
}: {
  newPagination?: PageResponse | undefined
  oldPagination: Pagination | undefined
}): Pagination => {
  if (!newPagination) {
    return {
      prev: null,
      current: null,
      next: null,
    }
  }

  const next = paginationUint8ArrayToString(newPagination.getNextKey_asB64())

  if (!oldPagination) {
    return {
      prev: null,
      current: null,
      next,
    }
  }

  return {
    prev: oldPagination.current,
    current: oldPagination.next,
    next,
  }
}
