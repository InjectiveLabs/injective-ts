import { GrpcException } from '@injectivelabs/exceptions'
import { AccountAddress } from '@injectivelabs/ts-types'
import { Query } from '@injectivelabs/chain-api/cosmos/bank/v1beta1/query_pb_service'
import {
  QueryBalanceRequest,
  QueryBalanceResponse,
} from '@injectivelabs/chain-api/cosmos/bank/v1beta1/query_pb'
import BaseChainConsumer from '../BaseChainConsumer'

export class ChainBankConsumer extends BaseChainConsumer {
  async getBalance(accountAddress: AccountAddress) {
    const queryBalance = new QueryBalanceRequest()
    queryBalance.setAddress(accountAddress)
    queryBalance.setDenom('inj')

    try {
      const response = await this.request<
        QueryBalanceRequest,
        QueryBalanceResponse,
        typeof Query.Balance
      >(queryBalance, Query.Balance)

      return response.getBalance()
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }
}
