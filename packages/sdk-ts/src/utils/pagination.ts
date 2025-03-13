import { ExchangePagination, PaginationOption } from '../types/pagination.js'
import { Pagination, PagePagination } from '../types/pagination.js'
import { CosmosBaseQueryV1Beta1Pagination } from '@injectivelabs/core-proto-ts'
import { InjectiveExplorerRpc } from '@injectivelabs/indexer-proto-ts'

export const paginationRequestFromPagination = (
  pagination?: PaginationOption,
): CosmosBaseQueryV1Beta1Pagination.PageRequest | undefined => {
  const paginationForRequest =
    CosmosBaseQueryV1Beta1Pagination.PageRequest.create()

  if (!pagination) {
    return
  }

  if (pagination.key) {
    paginationForRequest.key = Buffer.from(pagination.key, 'base64')
  }

  if (pagination.limit !== undefined) {
    paginationForRequest.limit = pagination.limit.toString()
  }

  if (pagination.offset !== undefined) {
    paginationForRequest.offset = pagination.offset.toString()
  }

  if (pagination.reverse !== undefined) {
    paginationForRequest.reverse = pagination.reverse
  }

  if (pagination.countTotal !== undefined) {
    paginationForRequest.countTotal = pagination.countTotal
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
  if (!key) {
    return ''
  }

  if (key.constructor !== Uint8Array) {
    return key as string
  }

  return Buffer.from(key).toString('base64')
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
  pagination: CosmosBaseQueryV1Beta1Pagination.PageResponse | undefined,
): Pagination => {
  return {
    total: pagination
      ? parseInt(paginationUint8ArrayToString(pagination.total), 10)
      : 0,
    next: pagination ? paginationUint8ArrayToString(pagination.nextKey) : '',
  }
}

export const grpcPagingToPaging = (
  pagination: InjectiveExplorerRpc.Paging | undefined,
): ExchangePagination => {
  if (!pagination) {
    return {
      to: 0,
      from: 0,
      total: 0,
    }
  }

  return {
    ...pagination,
    to: parseInt(pagination.to.toString() || '0', 10),
    from: parseInt(pagination.from.toString() || '0', 10),
    total: parseInt(pagination.total || '0', 10),
  }
}

export const fetchAllWithPagination = async <
  T extends
    | { pagination: PaginationOption | undefined }
    | PaginationOption
    | undefined,
  Q extends { pagination: Pagination },
>(
  args: T,
  method: (args: T) => Promise<Q>,
): Promise<Q> => {
  let result = [] as Array<unknown>
  let response = await method(args)

  if (!args) {
    return response
  }

  const paginationOption = (
    args as { pagination: PaginationOption | undefined }
  ).pagination

  if (!paginationOption) {
    return response
  }

  const keys = Object.keys(response)
  const valueKey = keys.find(
    (key) => key !== 'pagination',
  ) as keyof typeof response

  while (response.pagination.next) {
    result.push(response[valueKey])

    response = await method({
      ...args,
      pagination: { ...paginationOption, key: response.pagination.next },
    })
  }

  return { [valueKey]: result, pagination: response.pagination } as Q
}
