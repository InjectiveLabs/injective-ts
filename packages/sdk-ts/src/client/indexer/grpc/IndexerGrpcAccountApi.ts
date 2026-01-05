import { GeneralException } from '@injectivelabs/exceptions'
import * as InjectiveAccountsRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_accounts_rpc_pb'
import { InjectiveAccountsRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_accounts_rpc_pb.client'
import { IndexerModule } from '../types/index.js'
import { IndexerGrpcAccountTransformer } from '../transformers/index.js'
import BaseIndexerGrpcConsumer from '../../base/BaseIndexerGrpcConsumer.js'
import type { PaginationOption } from '../../../types/pagination.js'
import type { GrpcWebTransportAdditionalOptions } from '../../../utils/grpc.js'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcAccountApi extends BaseIndexerGrpcConsumer {
  protected module: string = IndexerModule.Account
  private client: InjectiveAccountsRPCClient

  constructor(endpoint: string, options?: GrpcWebTransportAdditionalOptions) {
    super(endpoint, options)
    this.client = new InjectiveAccountsRPCClient(this.transport)
  }

  /**
   * @deprecated - use IndexerGrpcAccountPortfolioApi.fetchPortfolio instead
   */
  async fetchPortfolio(_address: string) {
    throw new GeneralException(
      new Error(
        'deprecated - use IndexerGrpcAccountPortfolioApi.fetchPortfolio',
      ),
    )
  }

  async fetchRewards({ address, epoch }: { address: string; epoch: number }) {
    const request = InjectiveAccountsRpcPb.RewardsRequest.create()

    request.accountAddress = address

    if (epoch) {
      request.epoch = BigInt(epoch.toString())
    }

    const response = await this.executeGrpcCall<
      InjectiveAccountsRpcPb.RewardsRequest,
      InjectiveAccountsRpcPb.RewardsResponse
    >(request, this.client.rewards.bind(this.client))

    return IndexerGrpcAccountTransformer.tradingRewardsResponseToTradingRewards(
      response,
    )
  }

  async fetchSubaccountsList(address: string) {
    const request = InjectiveAccountsRpcPb.SubaccountsListRequest.create()

    request.accountAddress = address

    const response = await this.executeGrpcCall<
      InjectiveAccountsRpcPb.SubaccountsListRequest,
      InjectiveAccountsRpcPb.SubaccountsListResponse
    >(request, this.client.subaccountsList.bind(this.client))

    return response.subaccounts
  }

  async fetchSubaccountBalance(subaccountId: string, denom: string) {
    const request =
      InjectiveAccountsRpcPb.SubaccountBalanceEndpointRequest.create()

    request.subaccountId = subaccountId
    request.denom = denom

    const response = await this.executeGrpcCall<
      InjectiveAccountsRpcPb.SubaccountBalanceEndpointRequest,
      InjectiveAccountsRpcPb.SubaccountBalanceEndpointResponse
    >(request, this.client.subaccountBalanceEndpoint.bind(this.client))

    return IndexerGrpcAccountTransformer.balanceResponseToBalance(response)
  }

  async fetchSubaccountBalancesList(subaccountId: string) {
    const request =
      InjectiveAccountsRpcPb.SubaccountBalancesListRequest.create()

    request.subaccountId = subaccountId

    const response = await this.executeGrpcCall<
      InjectiveAccountsRpcPb.SubaccountBalancesListRequest,
      InjectiveAccountsRpcPb.SubaccountBalancesListResponse
    >(request, this.client.subaccountBalancesList.bind(this.client))

    return IndexerGrpcAccountTransformer.balancesResponseToBalances(response)
  }

  async fetchSubaccountHistory({
    subaccountId,
    denom,
    transferTypes = [],
    pagination,
  }: {
    subaccountId: string
    denom?: string
    transferTypes?: string[]
    pagination?: PaginationOption
  }) {
    const request = InjectiveAccountsRpcPb.SubaccountHistoryRequest.create()

    request.subaccountId = subaccountId

    if (denom) {
      request.denom = denom
    }

    if (transferTypes.length > 0) {
      request.transferTypes = transferTypes
    }

    if (pagination) {
      if (pagination.skip !== undefined) {
        request.skip = BigInt(pagination.skip.toString())
      }

      if (pagination.limit !== undefined) {
        request.limit = pagination.limit
      }

      if (pagination.endTime !== undefined) {
        request.endTime = BigInt(pagination.endTime.toString())
      }
    }

    const response = await this.executeGrpcCall<
      InjectiveAccountsRpcPb.SubaccountHistoryRequest,
      InjectiveAccountsRpcPb.SubaccountHistoryResponse
    >(request, this.client.subaccountHistory.bind(this.client))

    return IndexerGrpcAccountTransformer.transferHistoryResponseToTransferHistory(
      response,
    )
  }

  async fetchSubaccountOrderSummary({
    subaccountId,
    marketId,
    orderDirection,
  }: {
    subaccountId: string
    marketId?: string
    orderDirection?: string
  }) {
    const request =
      InjectiveAccountsRpcPb.SubaccountOrderSummaryRequest.create()

    request.subaccountId = subaccountId

    if (marketId) {
      request.marketId = marketId
    }

    if (orderDirection) {
      request.orderDirection = orderDirection
    }

    const response = await this.executeGrpcCall<
      InjectiveAccountsRpcPb.SubaccountOrderSummaryRequest,
      InjectiveAccountsRpcPb.SubaccountOrderSummaryResponse
    >(request, this.client.subaccountOrderSummary.bind(this.client))

    return response
  }

  async fetchOrderStates(params?: {
    spotOrderHashes?: string[]
    derivativeOrderHashes?: string[]
  }) {
    const { spotOrderHashes = [], derivativeOrderHashes = [] } = params || {}
    const request = InjectiveAccountsRpcPb.OrderStatesRequest.create()

    request.spotOrderHashes = spotOrderHashes
    request.derivativeOrderHashes = derivativeOrderHashes

    const response = await this.executeGrpcCall<
      InjectiveAccountsRpcPb.OrderStatesRequest,
      InjectiveAccountsRpcPb.OrderStatesResponse
    >(request, this.client.orderStates.bind(this.client))

    return response
  }
}
