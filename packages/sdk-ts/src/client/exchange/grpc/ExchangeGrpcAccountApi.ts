import {
  OrderStatesRequest,
  OrderStatesResponse,
  PortfolioRequest,
  PortfolioResponse,
  RewardsRequest,
  RewardsResponse,
  SubaccountBalanceRequest,
  SubaccountBalanceResponse,
  SubaccountBalancesListRequest,
  SubaccountBalancesListResponse,
  SubaccountHistoryRequest,
  SubaccountHistoryResponse,
  SubaccountOrderSummaryRequest,
  SubaccountOrderSummaryResponse,
  SubaccountsListRequest,
  SubaccountsListResponse,
} from '@injectivelabs/exchange-api/injective_accounts_rpc_pb'
import { InjectiveAccountsRPC } from '@injectivelabs/exchange-api/injective_accounts_rpc_pb_service'
import BaseConsumer from '../../BaseGrpcConsumer'
import { PaginationOption } from '../../../types/pagination'
import { ExchangeGrpcAccountTransformer } from '../transformers'

/**
 * @category Exchange Grpc API
 */
export class ExchangeGrpcAccountApi extends BaseConsumer {
  async fetchPortfolio(address: string) {
    const request = new PortfolioRequest()

    request.setAccountAddress(address)

    try {
      const response = await this.request<
        PortfolioRequest,
        PortfolioResponse,
        typeof InjectiveAccountsRPC.Portfolio
      >(request, InjectiveAccountsRPC.Portfolio)

      return ExchangeGrpcAccountTransformer.accountPortfolioResponseToAccountPortfolio(
        response,
      )
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchRewards({ address, epoch }: { address: string; epoch: number }) {
    const request = new RewardsRequest()

    request.setAccountAddress(address)

    if (epoch) {
      request.setEpoch(epoch)
    }

    try {
      const response = await this.request<
        RewardsRequest,
        RewardsResponse,
        typeof InjectiveAccountsRPC.Rewards
      >(request, InjectiveAccountsRPC.Rewards)

      return ExchangeGrpcAccountTransformer.tradingRewardsResponseToTradingRewards(
        response,
      )
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchSubaccountsList(address: string) {
    const request = new SubaccountsListRequest()

    request.setAccountAddress(address)

    try {
      const response = await this.request<
        SubaccountsListRequest,
        SubaccountsListResponse,
        typeof InjectiveAccountsRPC.SubaccountsList
      >(request, InjectiveAccountsRPC.SubaccountsList)

      return response.getSubaccountsList()
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchSubaccountBalance(subaccountId: string, denom: string) {
    const request = new SubaccountBalanceRequest()

    request.setSubaccountId(subaccountId)
    request.setDenom(denom)

    try {
      const response = await this.request<
        SubaccountBalanceRequest,
        SubaccountBalanceResponse,
        typeof InjectiveAccountsRPC.SubaccountBalanceEndpoint
      >(request, InjectiveAccountsRPC.SubaccountBalanceEndpoint)

      return ExchangeGrpcAccountTransformer.balanceResponseToBalance(response)
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchSubaccountBalancesList(subaccountId: string) {
    const request = new SubaccountBalancesListRequest()

    request.setSubaccountId(subaccountId)

    try {
      const response = await this.request<
        SubaccountBalancesListRequest,
        SubaccountBalancesListResponse,
        typeof InjectiveAccountsRPC.SubaccountBalancesList
      >(request, InjectiveAccountsRPC.SubaccountBalancesList)

      return ExchangeGrpcAccountTransformer.balancesResponseToBalances(response)
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchSubaccountHistory(params?: {
    subaccountId: string
    denom?: string
    transferTypes?: string[]
    pagination?: PaginationOption
  }) {
    const { subaccountId, denom, transferTypes = [], pagination } = params || {}

    const request = new SubaccountHistoryRequest()

    if (subaccountId) {
      request.setSubaccountId(subaccountId)
    }

    if (denom) {
      request.setDenom(denom)
    }

    if (transferTypes.length > 0) {
      request.setTransferTypesList(transferTypes)
    }

    if (pagination) {
      if (pagination.skip !== undefined) {
        request.setSkip(pagination.skip)
      }

      if (pagination.limit !== undefined) {
        request.setLimit(pagination.limit)
      }
    }

    try {
      const response = await this.request<
        SubaccountHistoryRequest,
        SubaccountHistoryResponse,
        typeof InjectiveAccountsRPC.SubaccountHistory
      >(request, InjectiveAccountsRPC.SubaccountHistory)

      return ExchangeGrpcAccountTransformer.transferHistoryResponseToTransferHistory(
        response,
      )
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchSubaccountOrderSummary({
    subaccountId,
    marketId,
    orderDirection,
  }: {
    subaccountId: string
    marketId?: string
    orderDirection?: string /* TODO */
  }) {
    const request = new SubaccountOrderSummaryRequest()

    request.setSubaccountId(subaccountId)

    if (marketId) {
      request.setMarketId(marketId)
    }

    if (orderDirection) {
      request.setOrderDirection(orderDirection)
    }

    try {
      const response = await this.request<
        SubaccountOrderSummaryRequest,
        SubaccountOrderSummaryResponse,
        typeof InjectiveAccountsRPC.SubaccountOrderSummary
      >(request, InjectiveAccountsRPC.SubaccountOrderSummary)

      return response.toObject()
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchOrderStates(params?: {
    spotOrderHashes?: string[]
    derivativeOrderHashes?: string[]
  }) {
    const { spotOrderHashes = [], derivativeOrderHashes = [] } = params || {}
    const request = new OrderStatesRequest()

    request.setSpotOrderHashesList(spotOrderHashes)
    request.setDerivativeOrderHashesList(derivativeOrderHashes)

    try {
      const response = await this.request<
        OrderStatesRequest,
        OrderStatesResponse,
        typeof InjectiveAccountsRPC.OrderStates
      >(request, InjectiveAccountsRPC.OrderStates)

      return response /* TODO */
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
