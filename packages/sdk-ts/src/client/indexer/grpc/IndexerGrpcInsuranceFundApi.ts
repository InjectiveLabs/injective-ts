import { IndexerGrpcInsuranceFundTransformer } from '../transformers'
import { IndexerModule } from '../types'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { getGrpcIndexerWebImpl } from '../../BaseIndexerGrpcWebConsumer'
import { InjectiveInsuranceRpc } from '@injectivelabs/indexer-proto-ts'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcInsuranceFundApi {
  protected module: string = IndexerModule.InsuranceFund

  protected client: InjectiveInsuranceRpc.InjectiveInsuranceRPCClientImpl

  constructor(endpoint: string) {
    this.client = new InjectiveInsuranceRpc.InjectiveInsuranceRPCClientImpl(
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
    const request = InjectiveInsuranceRpc.RedemptionsRequest.create()

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
      if (e instanceof InjectiveInsuranceRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Redemptions',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Redemptions',
        contextModule: this.module,
      })
    }
  }

  async fetchInsuranceFunds() {
    const request = InjectiveInsuranceRpc.FundsRequest.create()

    try {
      const response = await this.client.Funds(request)

      return IndexerGrpcInsuranceFundTransformer.insuranceFundsResponseToInsuranceFunds(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveInsuranceRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Funds',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Funds',
        contextModule: this.module,
      })
    }
  }
}
