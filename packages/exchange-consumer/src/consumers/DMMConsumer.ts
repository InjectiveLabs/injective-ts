import {
  GetEpochsRequest,
  GetEpochsResponse,
  GetDMMRecordsRequest,
  GetDMMRecordsResponse,
  GetEpochSummaryRequest,
  GetEpochSummaryResponse,
} from '@injectivelabs/exchange-api/injective_dmm_rpc_pb'
import { InjectiveDmmRPC } from '@injectivelabs/exchange-api/injective_dmm_rpc_pb_service'
import { GrpcException } from '@injectivelabs/exceptions'
import BaseConsumer from '../BaseConsumer'

export class DMMConsumer extends BaseConsumer {
  async fetchEpochs() {
    const request = new GetEpochsRequest()

    try {
      const response = await this.request<
        GetEpochsRequest,
        GetEpochsResponse,
        typeof InjectiveDmmRPC.GetEpochs
      >(request, InjectiveDmmRPC.GetEpochs)

      return response.getEpochsList()
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async fetchEpochSummary() {
    const request = new GetEpochSummaryRequest()

    try {
      const response = await this.request<
        GetEpochSummaryRequest,
        GetEpochSummaryResponse,
        typeof InjectiveDmmRPC.GetEpochSummary
      >(request, InjectiveDmmRPC.GetEpochSummary)

      return response.getEpoch()
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async fetchDMMRecords() {
    const request = new GetDMMRecordsRequest()

    try {
      const response = await this.request<
        GetDMMRecordsRequest,
        GetDMMRecordsResponse,
        typeof InjectiveDmmRPC.GetDMMRecords
      >(request, InjectiveDmmRPC.GetDMMRecords)

      return response
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }
}
