import { getRpcInterface } from '../../BaseGrpcConsumer'
import {
  QueryClientImpl,
  QueryInsuranceParamsRequest,
  QueryInsuranceFundRequest,
  QueryEstimatedRedemptionsRequest,
  QueryInsuranceFundsRequest,
  QueryPendingRedemptionsRequest,
} from '@injectivelabs/core-proto-ts/injective/insurance/v1beta1/query'
import { ChainGrpcInsuranceFundTransformer } from '../transformers/ChainGrpcInsuranceFundTransformer'
import { ChainModule } from '../types'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcInsuranceFundApi {
  protected module: string = ChainModule.InsuranceFund

  protected query: QueryClientImpl

  constructor(endpoint: string) {
    this.query = new QueryClientImpl(getRpcInterface(endpoint))
  }

  async fetchModuleParams() {
    const request = QueryInsuranceParamsRequest.create()

    try {
      const response = await this.query.InsuranceParams(request)

      return ChainGrpcInsuranceFundTransformer.moduleParamsResponseToModuleParams(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchInsuranceFunds() {
    const request = QueryInsuranceFundsRequest.create()

    try {
      const response = await this.query.InsuranceFunds(request)

      return ChainGrpcInsuranceFundTransformer.insuranceFundsResponseToInsuranceFunds(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchInsuranceFund(marketId: string) {
    const request = QueryInsuranceFundRequest.create()

    request.marketId = marketId

    try {
      const response = await this.query.InsuranceFund(request)

      return ChainGrpcInsuranceFundTransformer.insuranceFundResponseToInsuranceFund(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
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
    const request = QueryEstimatedRedemptionsRequest.create()

    request.marketId = marketId
    request.address = address

    try {
      const response = await this.query.EstimatedRedemptions(request)

      return ChainGrpcInsuranceFundTransformer.estimatedRedemptionsResponseToEstimatedRedemptions(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
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
    const request = QueryPendingRedemptionsRequest.create()

    request.marketId = marketId
    request.address = address

    try {
      const response = await this.query.PendingRedemptions(request)

      return ChainGrpcInsuranceFundTransformer.redemptionsResponseToRedemptions(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }
}
