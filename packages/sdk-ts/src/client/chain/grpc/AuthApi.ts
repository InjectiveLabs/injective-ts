import { Query as AuthQuery } from '@injectivelabs/chain-api/cosmos/auth/v1beta1/query_pb_service'
import {
  QueryAccountRequest,
  QueryAccountResponse,
} from '@injectivelabs/chain-api/cosmos/auth/v1beta1/query_pb'
import BaseConsumer from '../../BaseGrpcConsumer'

export class AuthApi extends BaseConsumer {
  async account(address: string) {
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
}
