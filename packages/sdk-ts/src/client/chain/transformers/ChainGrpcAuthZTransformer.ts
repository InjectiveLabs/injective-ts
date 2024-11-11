import { GeneralException } from '@injectivelabs/exceptions'
import { grpcPaginationToPagination } from '../../../utils/pagination.js'
import {
  GoogleProtobufAny,
  CosmosAuthzV1Beta1Authz,
  CosmosAuthzV1Beta1Query,
} from '@injectivelabs/core-proto-ts'
import {
  GrantAuthorizationWithDecodedAuthorization,
  GrantWithDecodedAuthorization,
} from '../types/index.js'

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcAuthZTransformer {
  static grpcGrantToGrant(
    grant: CosmosAuthzV1Beta1Authz.Grant,
  ): GrantWithDecodedAuthorization {
    const authorization = decodeAuthorizationNoThrow(grant.authorization)

    return {
      authorization: authorization?.authorization,
      authorizationType: authorization?.authorizationType || '',
      expiration: grant.expiration,
    }
  }

  static grpcGrantAuthorizationToGrantAuthorization(
    grant: CosmosAuthzV1Beta1Authz.GrantAuthorization,
  ): GrantAuthorizationWithDecodedAuthorization {
    const authorization = decodeAuthorizationNoThrow(grant.authorization)

    return {
      granter: grant.granter,
      grantee: grant.grantee,
      authorization: authorization?.authorization,
      authorizationType: authorization?.authorizationType || '',
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
      return {
        authorization: CosmosAuthzV1Beta1Authz.GenericAuthorization.decode(
          authorization.value,
        ),
        authorizationType: '/cosmos.authz.v1beta1.GenericAuthorization',
      }
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
