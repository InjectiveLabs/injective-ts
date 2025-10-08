import { CosmosBaseQueryV1Beta1Pagination } from '@injectivelabs/core-proto-ts'
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

  static pageRequestToGrpcPageRequest(pageRequest?: PaginationOption) {
    const paginationForRequest =
      CosmosBaseQueryV1Beta1Pagination.PageRequest.create()

    if (!pageRequest) {
      return
    }

    if (pageRequest.key) {
      paginationForRequest.key = Buffer.from(pageRequest.key, 'base64')
    }

    if (pageRequest.limit !== undefined) {
      paginationForRequest.limit = pageRequest.limit.toString()
    }

    if (pageRequest.offset !== undefined) {
      paginationForRequest.offset = pageRequest.offset.toString()
    }

    if (pageRequest.reverse !== undefined) {
      paginationForRequest.reverse = pageRequest.reverse
    }

    if (pageRequest.countTotal !== undefined) {
      paginationForRequest.countTotal = pageRequest.countTotal
    }

    return paginationForRequest
  }

  static paginationUint8ArrayToString(key: any): string {
    if (!key) {
      return ''
    }

    if (key.constructor !== Uint8Array) {
      return key as string
    }

    return Buffer.from(key).toString('base64')
  }

  static grpcPaginationToPagination(
    pagination: CosmosBaseQueryV1Beta1Pagination.PageResponse | undefined,
  ): Pagination {
    return {
      total: pagination
        ? parseInt(
            ChainGrpcCommonTransformer.paginationUint8ArrayToString(
              pagination.total,
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
}
