import { Query as WasmQuery } from '@injectivelabs/chain-api/cosmwasm/wasm/v1/query_pb_service'
import {
  QueryAllContractStateRequest,
  QueryAllContractStateResponse,
  QueryContractInfoRequest,
  QueryContractInfoResponse,
} from '@injectivelabs/chain-api/cosmwasm/wasm/v1/query_pb'
import BaseConsumer from '../../BaseGrpcConsumer'
import { ChainGrpcWasmTransformer } from '../transformers'
import { PaginationOption } from '../../../types/pagination'
import { paginationRequestFromPagination } from '../../../utils/pagination'

export class ChainGrpcWasmApi extends BaseConsumer {
  async fetchContractAccountsBalance({
    contractAddress,
    pagination,
  }: {
    contractAddress: string
    pagination?: PaginationOption
  }) {
    const request = new QueryAllContractStateRequest()
    request.setAddress(contractAddress)

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.setPagination(paginationForRequest)
    }

    try {
      const response = await this.request<
        QueryAllContractStateRequest,
        QueryAllContractStateResponse,
        typeof WasmQuery.AllContractState
      >(request, WasmQuery.AllContractState)
      return ChainGrpcWasmTransformer.allContractStateResponseToContractAccountsBalanceWithPagination(
        response,
      )
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchContractInfo(contractAddress: string) {
    const request = new QueryAllContractStateRequest()
    request.setAddress(contractAddress)

    try {
      const response = await this.request<
        QueryContractInfoRequest,
        QueryContractInfoResponse,
        typeof WasmQuery.ContractInfo
      >(request, WasmQuery.ContractInfo)
      const contractInfo = response.getContractInfo()

      if (!contractInfo) {
        return
      }

      return ChainGrpcWasmTransformer.contactInfoResponseToContractInfo(
        contractInfo,
      )
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
