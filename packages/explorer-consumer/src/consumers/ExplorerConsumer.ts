import { GrpcException } from '@injectivelabs/exceptions'
import {
  GetAccountTxsRequest,
  GetAccountTxsResponse,
  GetValidatorRequest,
  GetValidatorResponse,
  GetValidatorUptimeRequest,
  GetValidatorUptimeResponse,
} from '@injectivelabs/exchange-api/injective_explorer_rpc_pb'
import { InjectiveExplorerRPC } from '@injectivelabs/exchange-api/injective_explorer_rpc_pb_service'
import BaseConsumer from '../BaseConsumer'

export class ExplorerConsumer extends BaseConsumer {
  async fetchAccountTx({
    address,
    limit,
    type,
  }: {
    address: string
    limit: number
    type?: string
  }) {
    const request = new GetAccountTxsRequest()
    request.setAddress(address)

    if (limit) {
      request.setLimit(limit)
    }

    if (type) {
      request.setType(type)
    }

    try {
      const response = await this.request<
        GetAccountTxsRequest,
        GetAccountTxsResponse,
        typeof InjectiveExplorerRPC.GetAccountTxs
      >(request, InjectiveExplorerRPC.GetAccountTxs)

      return response.getDataList()
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async fetchValidator(validatorAddress: string) {
    const request = new GetValidatorRequest()
    request.setAddress(validatorAddress)

    try {
      const response = await this.request<
        GetValidatorRequest,
        GetValidatorResponse,
        typeof InjectiveExplorerRPC.GetValidator
      >(request, InjectiveExplorerRPC.GetValidator)

      return response
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async fetchValidatorUptime(validatorAddress: string) {
    const request = new GetValidatorUptimeRequest()
    request.setAddress(validatorAddress)

    try {
      const response = await this.request<
        GetValidatorUptimeRequest,
        GetValidatorUptimeResponse,
        typeof InjectiveExplorerRPC.GetValidatorUptime
      >(request, InjectiveExplorerRPC.GetValidatorUptime)

      return response
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }
}
