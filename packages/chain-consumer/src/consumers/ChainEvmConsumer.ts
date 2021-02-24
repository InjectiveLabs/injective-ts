import { GrpcException } from '@injectivelabs/exceptions'
import { AccountAddress } from '@injectivelabs/ts-types'
import { Query } from '@injectivelabs/chain-api/injective/evm/v1beta1/query_pb_service'
import {
  QueryCosmosAccountRequest,
  QueryCosmosAccountResponse,
} from '@injectivelabs/chain-api/injective/evm/v1beta1/query_pb'
import BaseChainConsumer from '../BaseChainConsumer'

export class ChainEvmConsumer extends BaseChainConsumer {
  async getCosmosDetails(accountAddress: AccountAddress) {
    const queryCosmosDetails = new QueryCosmosAccountRequest()
    queryCosmosDetails.setAddress(accountAddress)

    try {
      const response = await this.request<
        QueryCosmosAccountRequest,
        QueryCosmosAccountResponse,
        typeof Query.CosmosAccount
      >(queryCosmosDetails, Query.CosmosAccount)

      return response
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }
}
