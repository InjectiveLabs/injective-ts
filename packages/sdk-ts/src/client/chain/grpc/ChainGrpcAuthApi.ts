import { Query as AuthQuery } from '@injectivelabs/chain-api/cosmos/auth/v1beta1/query_pb_service'
import {
  QueryAccountRequest,
  QueryAccountsRequest,
  QueryAccountsResponse,
  QueryAccountResponse,
} from '@injectivelabs/chain-api/cosmos/auth/v1beta1/query_pb'
import BaseConsumer from '../../BaseGrpcConsumer'
import { PaginationOption } from '../../../types/pagination'
import { paginationRequestFromPagination } from '../../../utils/pagination'

export class ChainGrpcAuthApi extends BaseConsumer {
  async fetchAccount(address: string) {
    const request = new QueryAccountRequest()
    request.setAddress(address)

    try {
      const response = await this.request<
        QueryAccountRequest,
        QueryAccountResponse,
        typeof AuthQuery.Account
      >(request, AuthQuery.Account)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchAccounts(pagination?: PaginationOption) {
    const request = new QueryAccountsRequest()
    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.setPagination(paginationForRequest)
    }

    try {
      const response = await this.request<
        QueryAccountsRequest,
        QueryAccountsResponse,
        typeof AuthQuery.Accounts
      >(request, AuthQuery.Accounts)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
