import {
  UnspecifiedErrorCode,
  grpcErrorCodeToErrorCode,
  GrpcUnaryRequestException,
} from '@injectivelabs/exceptions'
import { InjectiveInsuranceV1Beta1Query } from '@injectivelabs/core-proto-ts'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { ChainModule } from '../types/index.js'
import { ChainGrpcInsuranceFundTransformer } from '../transformers/ChainGrpcInsuranceFundTransformer.js'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcInsuranceFundApi extends BaseGrpcConsumer {
  protected module: string = ChainModule.InsuranceFund

  protected client: InjectiveInsuranceV1Beta1Query.QueryClientImpl

  constructor(endpoint: string) {
    super(endpoint)

    this.client = new InjectiveInsuranceV1Beta1Query.QueryClientImpl(
      this.getGrpcWebImpl(endpoint),
    )
  }

  async fetchModuleParams() {
    const request =
      InjectiveInsuranceV1Beta1Query.QueryInsuranceParamsRequest.create()

    try {
      const response =
        await this.retry<InjectiveInsuranceV1Beta1Query.QueryInsuranceParamsResponse>(
          () => this.client.InsuranceParams(request, this.metadata),
        )

      return ChainGrpcInsuranceFundTransformer.moduleParamsResponseToModuleParams(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveInsuranceV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'InsuranceParams',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'InsuranceParams',
        contextModule: this.module,
      })
    }
  }

  async fetchInsuranceFunds() {
    const request =
      InjectiveInsuranceV1Beta1Query.QueryInsuranceFundsRequest.create()

    try {
      const response =
        await this.retry<InjectiveInsuranceV1Beta1Query.QueryInsuranceFundsResponse>(
          () => this.client.InsuranceFunds(request, this.metadata),
        )

      return ChainGrpcInsuranceFundTransformer.insuranceFundsResponseToInsuranceFunds(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveInsuranceV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'InsuranceFunds',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'InsuranceFunds',
        contextModule: this.module,
      })
    }
  }

  async fetchInsuranceFund(marketId: string) {
    const request =
      InjectiveInsuranceV1Beta1Query.QueryInsuranceFundRequest.create()

    request.marketId = marketId

    try {
      const response =
        await this.retry<InjectiveInsuranceV1Beta1Query.QueryInsuranceFundResponse>(
          () => this.client.InsuranceFund(request, this.metadata),
        )

      return ChainGrpcInsuranceFundTransformer.insuranceFundResponseToInsuranceFund(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveInsuranceV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'InsuranceFund',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'InsuranceFund',
        contextModule: this.module,
      })
    }
  }

  async fetchEstimatedRedemptions({
    marketId,
    address,
  }: {
    marketId: string
    address: string
  }) {
    const request =
      InjectiveInsuranceV1Beta1Query.QueryEstimatedRedemptionsRequest.create()

    request.marketId = marketId
    request.address = address

    try {
      const response =
        await this.retry<InjectiveInsuranceV1Beta1Query.QueryEstimatedRedemptionsResponse>(
          () => this.client.EstimatedRedemptions(request, this.metadata),
        )

      return ChainGrpcInsuranceFundTransformer.estimatedRedemptionsResponseToEstimatedRedemptions(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveInsuranceV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'EstimatedRedemptions',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'EstimatedRedemptions',
        contextModule: this.module,
      })
    }
  }

  async fetchPendingRedemptions({
    marketId,
    address,
  }: {
    marketId: string
    address: string
  }) {
    const request =
      InjectiveInsuranceV1Beta1Query.QueryPendingRedemptionsRequest.create()

    request.marketId = marketId
    request.address = address

    try {
      const response =
        await this.retry<InjectiveInsuranceV1Beta1Query.QueryPendingRedemptionsResponse>(
          () => this.client.PendingRedemptions(request, this.metadata),
        )

      return ChainGrpcInsuranceFundTransformer.redemptionsResponseToRedemptions(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveInsuranceV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'PendingRedemptions',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'PendingRedemptions',
        contextModule: this.module,
      })
    }
  }
}
