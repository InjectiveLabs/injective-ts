import {
  AuthorityMetadata,
  TokenFactoryModuleParams,
  TokenFactoryModuleState,
} from '../types/tokenfactory.js'
import { InjectiveTokenFactoryV1Beta1Query } from '@injectivelabs/core-proto-ts'

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcTokenFactoryTransformer {
  static moduleParamsResponseToModuleParams(
    response: InjectiveTokenFactoryV1Beta1Query.QueryParamsResponse,
  ): TokenFactoryModuleParams {
    const params = response.params!

    return {
      denomCreationFee: params.denomCreationFee,
    }
  }

  static moduleStateResponseToModuleState(
    response: InjectiveTokenFactoryV1Beta1Query.QueryModuleStateResponse,
  ): TokenFactoryModuleState {
    const state = response.state!

    return {
      denomCreationFee: state.params!.denomCreationFee,
      factoryDenoms: state.factoryDenoms.map((item) => ({
        denom: item.denom,
        authorityMetadata: item.authorityMetadata!,
      })),
    }
  }

  static denomsCreatorResponseToDenomsString(
    response: InjectiveTokenFactoryV1Beta1Query.QueryDenomsFromCreatorResponse,
  ): string[] {
    return response.denoms
  }

  static authorityMetadataResponseToAuthorityMetadata(
    response: InjectiveTokenFactoryV1Beta1Query.QueryDenomAuthorityMetadataResponse,
  ): AuthorityMetadata {
    return response.authorityMetadata!
  }
}
