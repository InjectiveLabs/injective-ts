import { grpcPaginationToPagination } from '../../../utils/pagination'
import {
  CosmosAuthzV1Beta1Authz,
  CosmosAuthzV1Beta1Query,
} from '@injectivelabs/core-proto-ts'

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcAuthzTransformer {
  static grpcGrantToGrant(grant: CosmosAuthzV1Beta1Authz.Grant) {
    return {
      authorization: grant.authorization
        ? Buffer.from(grant.authorization.value).toString('utf-8')
        : '',
      expiration: grant.expiration,
    }
  }

  static grpcGrantsToGrants(
    response: CosmosAuthzV1Beta1Query.QueryGrantsResponse,
  ) {
    return {
      pagination: grpcPaginationToPagination(response.pagination!),
      grants: response.grants.map(ChainGrpcAuthzTransformer.grpcGrantToGrant),
    }
  }
}
