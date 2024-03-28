import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { InjectiveTokenFactoryV1Beta1Query } from '@injectivelabs/core-proto-ts'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer'
import { ChainModule } from '../types'
import { ChainGrpcTokenFactoryTransformer } from '..'

/**
 * @category TokenFactory Grpc API
 */
export class ChainGrpcTokenFactoryApi extends BaseGrpcConsumer {
  protected module: string = ChainModule.WasmX

  protected client: InjectiveTokenFactoryV1Beta1Query.QueryClientImpl

  constructor(endpoint: string) {
    super(endpoint)

    this.client = new InjectiveTokenFactoryV1Beta1Query.QueryClientImpl(
      this.getGrpcWebImpl(endpoint),
    )
  }

  async fetchDenomsFromCreator(creator: string) {
    const request =
      InjectiveTokenFactoryV1Beta1Query.QueryDenomsFromCreatorRequest.create()

    request.creator = creator

    try {
      const response =
        await this.retry<InjectiveTokenFactoryV1Beta1Query.QueryDenomsFromCreatorResponse>(
          () => this.client.DenomsFromCreator(request, this.metadata),
        )

      return ChainGrpcTokenFactoryTransformer.denomsCreatorResponseToDenomsString(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveTokenFactoryV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'TokenFactoryDenomsFromCreator',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'TokenFactoryDenomsFromCreator',
        contextModule: this.module,
      })
    }
  }

  async fetchDenomAuthorityMetadata(creator: string, subDenom: string) {
    const request =
      InjectiveTokenFactoryV1Beta1Query.QueryDenomAuthorityMetadataRequest.create()

    request.creator = creator
    request.subDenom = subDenom

    try {
      const response =
        await this.retry<InjectiveTokenFactoryV1Beta1Query.QueryDenomAuthorityMetadataResponse>(
          () => this.client.DenomAuthorityMetadata(request, this.metadata),
        )

      return ChainGrpcTokenFactoryTransformer.authorityMetadataResponseToAuthorityMetadata(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveTokenFactoryV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'TokenFactoryDenomsFromCreator',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'TokenFactoryDenomsFromCreator',
        contextModule: this.module,
      })
    }
  }

  async fetchModuleParams() {
    const request =
      InjectiveTokenFactoryV1Beta1Query.QueryParamsRequest.create()

    try {
      const response =
        await this.retry<InjectiveTokenFactoryV1Beta1Query.QueryParamsResponse>(
          () => this.client.Params(request, this.metadata),
        )

      return ChainGrpcTokenFactoryTransformer.moduleParamsResponseToModuleParams(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveTokenFactoryV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'TokenFactoryParams',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'TokenFactoryParams',
        contextModule: this.module,
      })
    }
  }

  async fetchModuleState() {
    const request =
      InjectiveTokenFactoryV1Beta1Query.QueryModuleStateRequest.create()

    try {
      const response =
        await this.retry<InjectiveTokenFactoryV1Beta1Query.QueryModuleStateResponse>(
          () => this.client.TokenfactoryModuleState(request, this.metadata),
        )

      return ChainGrpcTokenFactoryTransformer.moduleStateResponseToModuleState(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveTokenFactoryV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'TokenFactoryModuleState',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'TokenFactoryModuleState',
        contextModule: this.module,
      })
    }
  }
}
