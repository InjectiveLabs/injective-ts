import { GrpcException } from '@injectivelabs/exceptions'
import { InjectiveDmmRPC } from '@injectivelabs/dmm-api/injective_dmm_rpc_pb_service'
import {
  GetEpochsResponse,
  GetDMMRecordsRequest,
  GetDMMRecordsResponse,
  GetEpochSummaryRequest,
  GetEpochSummaryResponse,
} from '@injectivelabs/dmm-api/injective_dmm_rpc_pb'
import { Empty } from 'google-protobuf/google/protobuf/empty_pb'
import BaseConsumer from '../BaseConsumer'

export class DMMConsumer extends BaseConsumer {
  async fetchEpochs() {
    const request = new Empty()

    try {
      const response = await this.request<
        Empty,
        GetEpochsResponse,
        typeof InjectiveDmmRPC.GetEpochs
      >(request, InjectiveDmmRPC.GetEpochs)

      return response.getEpochsList()
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async fetchEpochSummary({ epochId }: { epochId?: string }) {
    const request = new GetEpochSummaryRequest()

    if (epochId) {
      request.setEpochId(epochId)
    }

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

  async fetchDMMRecords({
    accountAddress,
    dmmName,
    epochId,
  }: {
    accountAddress?: string
    dmmName?: string
    epochId?: string
  }) {
    const request = new GetDMMRecordsRequest()

    if (accountAddress) {
      request.setAccountAddress(accountAddress)
    }

    if (dmmName) {
      request.setDmmName(dmmName)
    }

    if (epochId) {
      request.setEpochId(epochId)
    }

    try {
      const response = await this.request<
        GetDMMRecordsRequest,
        GetDMMRecordsResponse,
        typeof InjectiveDmmRPC.GetDMMRecords
      >(request, InjectiveDmmRPC.GetDMMRecords)

      return response.getRecordsList()
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }
}
