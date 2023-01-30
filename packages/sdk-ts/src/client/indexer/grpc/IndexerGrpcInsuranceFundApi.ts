import {
  InjectiveInsuranceRPCClientImpl,
  FundsRequest,
  RedemptionsRequest,
} from '@injectivelabs/indexer-proto-ts/injective_insurance_rpc'
import { IndexerGrpcInsuranceFundTransformer } from '../transformers'
import { IndexerModule } from '../types'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { getGrpcIndexerWebImpl } from '../../BaseIndexerGrpcWebConsumer'
import { GrpcWebError } from '@injectivelabs/indexer-proto-ts/injective_explorer_rpc'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcInsuranceFundApi {
  protected module: string = IndexerModule.InsuranceFund

  protected client: InjectiveInsuranceRPCClientImpl

  constructor(endpoint: string) {
    this.client = new InjectiveInsuranceRPCClientImpl(
      getGrpcIndexerWebImpl(endpoint),
    )
  }

  async fetchRedemptions({
    denom,
    address,
    status,
  }: {
    address: string
    denom?: string
    status?: string
  }) {
    const request = RedemptionsRequest.create()

    request.redeemer = address

    if (denom) {
      request.redemptionDenom = denom
    }

    if (status) {
      request.status = status
    }

    try {
      const response = await this.client.Redemptions(request)

      return IndexerGrpcInsuranceFundTransformer.redemptionsResponseToRedemptions(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchInsuranceFunds() {
    const request = FundsRequest.create()

    try {
      const response = await this.client.Funds(request)

      return IndexerGrpcInsuranceFundTransformer.insuranceFundsResponseToInsuranceFunds(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }
}
