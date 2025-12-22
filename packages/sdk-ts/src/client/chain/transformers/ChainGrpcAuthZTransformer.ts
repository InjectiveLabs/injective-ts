import { GeneralException } from '@injectivelabs/exceptions'
import * as CosmosAuthzV1Beta1AuthzPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/authz/v1beta1/authz_pb'
import { ChainGrpcCommonTransformer } from './ChainGrpcCommonTransformer.js'
import type * as GoogleProtobufAnyPbPb from '@injectivelabs/core-proto-ts-v2/generated/google/protobuf/any_pb'
import type * as CosmosAuthzV1Beta1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/authz/v1beta1/query_pb'
import type {
  GrantWithDecodedAuthorization,
  GrantAuthorizationWithDecodedAuthorization,
} from '../types/index.js'

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcAuthZTransformer {
  static grpcGrantToGrant(
    grant: CosmosAuthzV1Beta1AuthzPb.Grant,
  ): GrantWithDecodedAuthorization {
    const authorization = decodeAuthorizationNoThrow(grant.authorization)

    return {
      authorization: authorization?.authorization,
      authorizationType: authorization?.authorizationType || '',
      expiration: grant.expiration,
    }
  }

  static grpcGrantAuthorizationToGrantAuthorization(
    grant: CosmosAuthzV1Beta1AuthzPb.GrantAuthorization,
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
    response: CosmosAuthzV1Beta1QueryPb.QueryGrantsResponse,
  ) {
    return {
      pagination: ChainGrpcCommonTransformer.grpcPaginationToPaginationV2(
        response.pagination!,
      ),
      grants: response.grants.map(ChainGrpcAuthZTransformer.grpcGrantToGrant),
    }
  }

  static grpcGranteeGrantsToGranteeGrants(
    response: CosmosAuthzV1Beta1QueryPb.QueryGranteeGrantsResponse,
  ) {
    return {
      pagination: ChainGrpcCommonTransformer.grpcPaginationToPaginationV2(
        response.pagination!,
      ),
      grants: response.grants.map(
        ChainGrpcAuthZTransformer.grpcGrantAuthorizationToGrantAuthorization,
      ),
    }
  }

  static grpcGranterGrantsToGranterGrants(
    response: CosmosAuthzV1Beta1QueryPb.QueryGranterGrantsResponse,
  ) {
    return {
      pagination: ChainGrpcCommonTransformer.grpcPaginationToPaginationV2(
        response.pagination!,
      ),
      grants: response.grants.map(
        ChainGrpcAuthZTransformer.grpcGrantAuthorizationToGrantAuthorization,
      ),
    }
  }
}

const decodeAuthorization = (authorization: GoogleProtobufAnyPbPb.Any) => {
  switch (authorization.typeUrl) {
    case '/cosmos.authz.v1beta1.GenericAuthorization':
      return {
        authorization:
          CosmosAuthzV1Beta1AuthzPb.GenericAuthorization.fromBinary(
            authorization.value,
          ),
        authorizationType: '/cosmos.authz.v1beta1.GenericAuthorization',
      }
    default:
      throw new GeneralException(new Error('Unsupported authorization type'))
  }
}

const decodeAuthorizationNoThrow = (
  authorization?: GoogleProtobufAnyPbPb.Any,
) => {
  if (!authorization) {
    return undefined
  }

  try {
    return decodeAuthorization(authorization)
  } catch {
    return undefined
  }
}
