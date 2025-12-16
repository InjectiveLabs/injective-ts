import { ChainGrpcCommonTransformer } from '../client/chain/transformers/ChainGrpcCommonTransformer.js'
import type * as InjectiveAccountsRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_accounts_rpc_pb'
import type * as InjectiveExplorerRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_explorer_rpc_pb'
import type * as CosmosBaseQueryV1Beta1PaginationPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/query/v1beta1/pagination_pb'
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
): CosmosBaseQueryV1Beta1PaginationPb.PageRequest | undefined => {
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
  pagination: CosmosBaseQueryV1Beta1PaginationPb.PageResponse | undefined,
): Pagination => {
  return ChainGrpcCommonTransformer.grpcPaginationToPagination(pagination)
}

/**
 * @deprecated Use grpcPagingToPagingV2 instead (V1 proto package)
 */
export const grpcPagingToPaging = (
  pagination: InjectiveExplorerRpcPb.Paging | undefined,
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
    total: parseInt((pagination.total || 0n).toString(), 10),
  }
}

/**
 * Converts gRPC Paging to ExchangePagination for V2 proto packages.
 * Handles both InjectiveAccountsRpcPb.Paging and InjectiveExplorerRpcPb.Paging types.
 * Supports bigint and string types for the total field.
 */
export const grpcPagingToPagingV2 = (
  pagination:
    | InjectiveAccountsRpcPb.Paging
    | InjectiveExplorerRpcPb.Paging
    | undefined,
): ExchangePagination => {
  if (!pagination) {
    return {
      to: 0,
      from: 0,
      total: 0,
    }
  }

  const total = pagination.total
  const totalNumber =
    typeof total === 'bigint'
      ? Number(total)
      : typeof total === 'string'
        ? parseInt(total || '0', 10)
        : parseInt(String(total) || '0', 10)

  return {
    ...pagination,
    to: parseInt(pagination.to.toString() || '0', 10),
    from: parseInt(pagination.from.toString() || '0', 10),
    total: totalNumber,
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
