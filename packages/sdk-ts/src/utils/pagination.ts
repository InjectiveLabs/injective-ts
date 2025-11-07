import { ChainGrpcCommonTransformer } from '../client/chain/transformers/ChainGrpcCommonTransformer.js'
import type { InjectiveExplorerRpc } from '@injectivelabs/indexer-proto-ts'
import type { InjectiveAccountsRpcPb } from '@injectivelabs/indexer-proto-ts-v2'
import type { CosmosBaseQueryV1Beta1Pagination } from '@injectivelabs/core-proto-ts'
import type * as CosmosBaseQueryV1Beta1PaginationPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/query/v1beta1/pagination_pb.mjs'
import type {
  Pagination,
  PaginationOption,
  ExchangePagination,
} from '../types/pagination.js'

/**
 * @deprecated Use ChainGrpcCommonTransformer.pageRequestToGrpcPageRequest instead
 */

export const paginationRequestFromPagination = (
  pagination?: PaginationOption,
): CosmosBaseQueryV1Beta1Pagination.PageRequest | undefined => {
  return ChainGrpcCommonTransformer.pageRequestToGrpcPageRequest(pagination)
}

export const pageRequestToGrpcPageRequestV2 = (
  pagination?: PaginationOption,
): CosmosBaseQueryV1Beta1PaginationPb.PageRequest | undefined => {
  return ChainGrpcCommonTransformer.pageRequestToGrpcPageRequestV2(pagination)
}

/**
 * @deprecated Use ChainGrpcCommonTransformer.paginationUint8ArrayToString instead
 */
export const paginationUint8ArrayToString = (key: any) => {
  return ChainGrpcCommonTransformer.paginationUint8ArrayToString(key)
}

/**
 * @deprecated Use ChainGrpcCommonTransformer.grpcPaginationToPagination instead
 */
export const grpcPaginationToPagination = (
  pagination: CosmosBaseQueryV1Beta1Pagination.PageResponse | undefined,
): Pagination => {
  return ChainGrpcCommonTransformer.grpcPaginationToPagination(pagination)
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

export const grpcPagingToPagingV2 = (
  pagination: InjectiveAccountsRpcPb.Paging | undefined,
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
    total: parseInt(pagination.total.toString() || '0', 10),
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
  result: Array<unknown> = [],
): Promise<Q> => {
  let response = await method(args)

  if (!args) {
    return response
  }

  const keys = Object.keys(response)
  const valueKey = keys.find(
    (key) => key !== 'pagination',
  ) as keyof typeof response

  result.push(...(response[valueKey] as Array<unknown>))

  const paginationOption = args as PaginationOption

  if (response.pagination.next) {
    return fetchAllWithPagination(
      { ...paginationOption, key: response.pagination.next } as T,
      method,
      result,
    )
  }

  return { [valueKey]: result, pagination: response.pagination } as Q
}
