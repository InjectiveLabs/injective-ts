import { Query } from '@injectivelabs/chain-api/cosmos/mint/v1beta1/query_pb_service'
import {
  QueryInflationRequest,
  QueryParamsRequest,
  QueryParamsResponse,
  QueryInflationResponse,
  QueryAnnualProvisionsRequest,
  QueryAnnualProvisionsResponse,
} from '@injectivelabs/chain-api/cosmos/mint/v1beta1/query_pb'
import { GrpcException } from '@injectivelabs/exceptions'
import BaseConsumer from '../BaseConsumer'
import { GrpcMintParams } from '../types'

export class MintConsumer extends BaseConsumer {
  async fetchParams() {
    const request = new QueryParamsRequest()

    try {
      const response = await this.request<
        QueryParamsRequest,
        QueryParamsResponse,
        typeof Query.Params
      >(request, Query.Params)

      return response.getParams() as GrpcMintParams
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async fetchInflation() {
    const request = new QueryInflationRequest()

    try {
      const response = await this.request<
        QueryInflationRequest,
        QueryInflationResponse,
        typeof Query.Inflation
      >(request, Query.Inflation)

      return response.getInflation()
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async fetchAnnualProvisions() {
    const request = new QueryAnnualProvisionsRequest()

    try {
      const response = await this.request<
        QueryAnnualProvisionsRequest,
        QueryAnnualProvisionsResponse,
        typeof Query.AnnualProvisions
      >(request, Query.AnnualProvisions)

      return response.getAnnualProvisions()
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }
}
