import {
  GetLatestEpochRequest,
  GetLatestEpochResponse,
} from '@injectivelabs/exchange-api/injective_dmm_rpc_pb'
import { InjectiveDmmRPC } from '@injectivelabs/exchange-api/injective_dmm_rpc_pb_service'
import { GrpcException } from '@injectivelabs/exceptions'
import BaseConsumer from '../BaseConsumer'

export class DMMConsumer extends BaseConsumer {
  async fetchLatestEpoch() {
    const request = new GetLatestEpochRequest()

    try {
      const response = await this.request<
        GetLatestEpochRequest,
        GetLatestEpochResponse,
        typeof InjectiveDmmRPC.GetLatestEpoch
      >(request, InjectiveDmmRPC.GetLatestEpoch)

      return response.getEpoch()
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }
}
