import { PageResponse as GrpcPageResponse } from '@injectivelabs/chain-api/cosmos/base/query/v1beta1/pagination_pb'

export interface PageResponse {
  nextKey: Uint8Array | string
  total: number
}

export { GrpcPageResponse }
