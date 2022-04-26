import { Query as MintQuery } from '@injectivelabs/chain-api/cosmos/mint/v1beta1/query_pb_service'
import {
  QueryInflationRequest,
  QueryParamsRequest as QueryMintParamsRequest,
  QueryParamsResponse as QueryMintParamsResponse,
  QueryInflationResponse,
  QueryAnnualProvisionsRequest,
  QueryAnnualProvisionsResponse,
} from '@injectivelabs/chain-api/cosmos/mint/v1beta1/query_pb'
import BaseConsumer from '../../BaseGrpcConsumer'

export class MintApi extends BaseConsumer {
  async moduleParams() {
    const request = new QueryMintParamsRequest()

    try {
      const response = await this.request<
        QueryMintParamsRequest,
        QueryMintParamsResponse,
        typeof MintQuery.Params
      >(request, MintQuery.Params)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async inflation() {
    const request = new QueryInflationRequest()

    try {
      const response = await this.request<
        QueryInflationRequest,
        QueryInflationResponse,
        typeof MintQuery.Inflation
      >(request, MintQuery.Inflation)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async annualProvisions() {
    const request = new QueryAnnualProvisionsRequest()

    try {
      const response = await this.request<
        QueryAnnualProvisionsRequest,
        QueryAnnualProvisionsResponse,
        typeof MintQuery.AnnualProvisions
      >(request, MintQuery.AnnualProvisions)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
