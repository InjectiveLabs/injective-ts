import * as CosmosBaseQueryV1Beta1PaginationPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/query/v1beta1/pagination_pb.mjs'
import type { Coin } from '@injectivelabs/ts-types'
import type { GrpcCoin } from '../../../types/index.js'
import type { Pagination, PaginationOption } from '../../../types/pagination.js'

export class ChainGrpcCommonTransformer {
  static grpcCoinToCoin(coin: GrpcCoin): Coin {
    return {
      denom: coin.denom,
      amount: coin.amount,
    }
  }

  static pageRequestToGrpcPageRequestV2(pageRequest?: PaginationOption) {
    if (!pageRequest) {
      return
    }

    const paginationForRequest =
      CosmosBaseQueryV1Beta1PaginationPb.PageRequest.create({
        key: pageRequest?.key
          ? Buffer.from(pageRequest.key, 'base64')
          : undefined,
        limit: pageRequest?.limit ? BigInt(pageRequest.limit) : undefined,
        offset: pageRequest?.offset ? BigInt(pageRequest.offset) : undefined,
        reverse: pageRequest?.reverse ? pageRequest.reverse : undefined,
        countTotal: pageRequest?.countTotal
          ? pageRequest.countTotal
          : undefined,
      })

    return paginationForRequest
  }

  static pageRequestToGrpcPageRequest(pageRequest?: PaginationOption) {
    if (!pageRequest) {
      return
    }

    const paginationForRequest =
      CosmosBaseQueryV1Beta1PaginationPb.PageRequest.create({
        key: pageRequest?.key
          ? Buffer.from(pageRequest.key, 'base64')
          : undefined,
        limit: pageRequest?.limit ? BigInt(pageRequest.limit) : undefined,
        offset: pageRequest?.offset ? BigInt(pageRequest.offset) : undefined,
        reverse: pageRequest?.reverse ? pageRequest.reverse : undefined,
        countTotal: pageRequest?.countTotal
          ? pageRequest.countTotal
          : undefined,
      })

    return paginationForRequest
  }

  static paginationUint8ArrayToString(
    key: Uint8Array | string | undefined,
  ): string {
    if (!key) {
      return ''
    }

    if (key.constructor !== Uint8Array) {
      return key as string
    }

    return Buffer.from(key).toString('base64')
  }

  static grpcPaginationToPagination(
    pagination: CosmosBaseQueryV1Beta1PaginationPb.PageResponse | undefined,
  ): Pagination {
    return {
      total: pagination
        ? parseInt(
            ChainGrpcCommonTransformer.paginationUint8ArrayToString(
              pagination.total.toString(),
            ),
            10,
          )
        : 0,
      next: pagination
        ? ChainGrpcCommonTransformer.paginationUint8ArrayToString(
            pagination.nextKey,
          )
        : '',
    }
  }

  static grpcPaginationToPaginationV2(
    pagination: CosmosBaseQueryV1Beta1PaginationPb.PageResponse | undefined,
  ): Pagination {
    return {
      total: pagination ? Number(pagination.total) : 0,
      next: pagination
        ? ChainGrpcCommonTransformer.paginationUint8ArrayToString(
            pagination.nextKey,
          )
        : '',
    }
  }
}
