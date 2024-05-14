import { GeneralException } from '@injectivelabs/exceptions'
import { grpcPaginationToPagination } from '../../../utils/pagination'
import {
  GoogleProtobufAny,
  CosmosAuthzV1Beta1Authz,
  CosmosAuthzV1Beta1Query,
} from '@injectivelabs/core-proto-ts'

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcAuthZTransformer {
  static grpcGrantToGrant(grant: CosmosAuthzV1Beta1Authz.Grant) {
    return {
      authorization: decodeAuthorizationNoThrow(grant.authorization),
      expiration: grant.expiration,
    }
  }

  static grpcGrantAuthorizationToGrantAuthorization(
    grant: CosmosAuthzV1Beta1Authz.GrantAuthorization,
  ) {
    return {
      granter: grant.granter,
      grantee: grant.grantee,
      authorization: decodeAuthorizationNoThrow(grant.authorization),
      expiration: grant.expiration,
    }
  }

  static grpcGrantsToGrants(
    response: CosmosAuthzV1Beta1Query.QueryGrantsResponse,
  ) {
    return {
      pagination: grpcPaginationToPagination(response.pagination!),
      grants: response.grants.map(ChainGrpcAuthZTransformer.grpcGrantToGrant),
    }
  }

  static grpcGranteeGrantsToGranteeGrants(
    response: CosmosAuthzV1Beta1Query.QueryGranteeGrantsResponse,
  ) {
    return {
      pagination: grpcPaginationToPagination(response.pagination!),
      grants: response.grants.map(
        ChainGrpcAuthZTransformer.grpcGrantAuthorizationToGrantAuthorization,
      ),
    }
  }

  static grpcGranterGrantsToGranterGrants(
    response: CosmosAuthzV1Beta1Query.QueryGranterGrantsResponse,
  ) {
    return {
      pagination: grpcPaginationToPagination(response.pagination!),
      grants: response.grants.map(
        ChainGrpcAuthZTransformer.grpcGrantAuthorizationToGrantAuthorization,
      ),
    }
  }
}

const decodeAuthorization = (authorization: GoogleProtobufAny.Any) => {
  switch (authorization.typeUrl) {
    case '/cosmos.authz.v1beta1.GenericAuthorization':
      return CosmosAuthzV1Beta1Authz.GenericAuthorization.decode(
        authorization.value,
      )
    default:
      throw new GeneralException(new Error('Unsupported authorization type'))
  }
}

const decodeAuthorizationNoThrow = (authorization?: GoogleProtobufAny.Any) => {
  if (!authorization) {
    return undefined
  }

  try {
    return decodeAuthorization(authorization)
  } catch {
    return undefined
  }
}
