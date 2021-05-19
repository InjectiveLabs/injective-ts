import {
  OracleListRequest,
  OracleListResponse,
} from '@injectivelabs/exchange-api/injective_oracle_rpc_pb'
import { InjectiveOracleRPC } from '@injectivelabs/exchange-api/injective_oracle_rpc_pb_service'
import { GrpcException } from '@injectivelabs/exceptions'
import BaseConsumer from '../BaseConsumer'

export class OracleConsumer extends BaseConsumer {
  async oracles() {
    const request = new OracleListRequest()

    try {
      const response = await this.request<
        OracleListRequest,
        OracleListResponse,
        typeof InjectiveOracleRPC.OracleList
      >(request, InjectiveOracleRPC.OracleList)

      return response.getOraclesList()
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }
}
