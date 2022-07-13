import { PageRequest } from '@injectivelabs/chain-api/cosmos/base/query/v1beta1/pagination_pb'
import { ExchangePagination, PaginationOption } from '../types/pagination'
import { Pagination, PagePagination } from '../types/pagination'
import { PageResponse } from '@injectivelabs/chain-api/cosmos/base/query/v1beta1/pagination_pb'
import { Paging } from '@injectivelabs/exchange-api/injective_explorer_rpc_pb'

export const paginationRequestFromPagination = (
  pagination?: PaginationOption,
): PageRequest | undefined => {
  const paginationForRequest = new PageRequest()

  if (!pagination) {
    return
  }

  if (pagination.key) {
    paginationForRequest.setKey(pagination.key)
  }

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

export const generatePagination = (
  pagination: Pagination | PagePagination | undefined,
) => {
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
  oldPagination: PagePagination | undefined
  newPagination?: Pagination | undefined
}): PagePagination => {
  if (!newPagination) {
    return {
      prev: null,
      current: null,
      next: null,
    }
  }

  const next = paginationUint8ArrayToString(newPagination.next)

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

export const grpcPaginationToPagination = (
  pagination: PageResponse | undefined,
): Pagination => {
  return {
    total: pagination
      ? parseInt(paginationUint8ArrayToString(pagination.getTotal()), 10)
      : 0,
    next: pagination
      ? paginationUint8ArrayToString(pagination.getNextKey_asB64())
      : '',
  }
}

export const grpcPagingToPaging = (
  pagination: Paging | undefined,
): ExchangePagination => {
  if (!pagination) {
    return {
      to: 0,
      from: 0,
      total: 0,
    }
  }

  return {
    ...pagination.toObject(),
    to: pagination.getTo() || 0,
    from: pagination.getFrom() || 0,
  }
}
