import type { GenesisDenom } from '@injectivelabs/core-proto-ts-v2/generated/injective/tokenfactory/v1beta1/genesis_pb.mjs'
import type * as InjectiveTokenFactoryV1Beta1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/injective/tokenfactory/v1beta1/query_pb.mjs'
import type {
  AuthorityMetadata,
  TokenFactoryModuleState,
  TokenFactoryModuleParams,
} from '../types/tokenfactory.js'

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcTokenFactoryTransformer {
  static moduleParamsResponseToModuleParams(
    response: InjectiveTokenFactoryV1Beta1QueryPb.QueryParamsResponse,
  ): TokenFactoryModuleParams {
    const params = response.params!

    return {
      denomCreationFee: params.denomCreationFee,
    }
  }

  static moduleStateResponseToModuleState(
    response: InjectiveTokenFactoryV1Beta1QueryPb.QueryModuleStateResponse,
  ): TokenFactoryModuleState {
    const state = response.state!

    return {
      denomCreationFee: state.params!.denomCreationFee,
      factoryDenoms: state.factoryDenoms.map((item: GenesisDenom) => ({
        denom: item.denom,
        authorityMetadata: item.authorityMetadata!,
      })),
    }
  }

  static denomsCreatorResponseToDenomsString(
    response: InjectiveTokenFactoryV1Beta1QueryPb.QueryDenomsFromCreatorResponse,
  ): string[] {
    return response.denoms
  }

  static authorityMetadataResponseToAuthorityMetadata(
    response: InjectiveTokenFactoryV1Beta1QueryPb.QueryDenomAuthorityMetadataResponse,
  ): AuthorityMetadata {
    return response.authorityMetadata!
  }
}
