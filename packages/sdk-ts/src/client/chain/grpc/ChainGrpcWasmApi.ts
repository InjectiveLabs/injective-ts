import { Query as WasmQuery } from '@injectivelabs/chain-api/cosmwasm/wasm/v1/query_pb_service'
import {
  QueryAllContractStateRequest,
  QueryAllContractStateResponse,
} from '@injectivelabs/chain-api/cosmwasm/wasm/v1/query_pb'
import BaseConsumer from '../../BaseGrpcConsumer'
import { ChainGrpcWasmTransformer } from '../transformers'

export class ChainGrpcWasmApi extends BaseConsumer {
  async fetchContractAccountsBalance(contractAddress: string) {
    const request = new QueryAllContractStateRequest()
    request.setAddress(contractAddress)

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
}
