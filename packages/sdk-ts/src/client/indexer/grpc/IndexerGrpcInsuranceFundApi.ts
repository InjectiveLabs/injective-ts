import {
  FundsRequest,
  FundsResponse,
  RedemptionsRequest,
  RedemptionsResponse,
} from '@injectivelabs/indexer-api/injective_insurance_rpc_pb'
import { InjectiveInsuranceRPC } from '@injectivelabs/indexer-api/injective_insurance_rpc_pb_service'
import BaseConsumer from '../../BaseGrpcConsumer'
import { IndexerGrpcInsuranceFundTransformer } from '../transformers'
import { IndexerModule } from '../types'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcInsuranceFundApi extends BaseConsumer {
  protected module: string = IndexerModule.InsuranceFund

  async fetchRedemptions({
    denom,
    address,
    status,
  }: {
    address: string
    denom?: string
    status?: string
  }) {
    const request = new RedemptionsRequest()

    request.setRedeemer(address)

    if (denom) {
      request.setRedemptionDenom(denom)
    }

    if (status) {
      request.setStatus(status)
    }

    try {
      const response = await this.request<
        RedemptionsRequest,
        RedemptionsResponse,
        typeof InjectiveInsuranceRPC.Redemptions
      >(request, InjectiveInsuranceRPC.Redemptions)

      return IndexerGrpcInsuranceFundTransformer.redemptionsResponseToRedemptions(
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
    const request = new FundsRequest()

    try {
      const response = await this.request<
        FundsRequest,
        FundsResponse,
        typeof InjectiveInsuranceRPC.Funds
      >(request, InjectiveInsuranceRPC.Funds)

      return IndexerGrpcInsuranceFundTransformer.insuranceFundsResponseToInsuranceFunds(
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
