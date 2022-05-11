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

export class AccountApi extends BaseConsumer {
  async fetchPortfolio(address: string) {
    const request = new PortfolioRequest()
    request.setAccountAddress(address)

    try {
      const response = await this.request<
        PortfolioRequest,
        PortfolioResponse,
        typeof InjectiveAccountsRPC.Portfolio
      >(request, InjectiveAccountsRPC.Portfolio)

      return response.getPortfolio()
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

      return response
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

      return response
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

      return response
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

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchSubaccountHistory({
    subaccountId,
    denom,
    transferTypes = [],
  }: {
    subaccountId: string
    denom?: string
    transferTypes?: string[] /* TODO */
  }) {
    const request = new SubaccountHistoryRequest()
    request.setSubaccountId(subaccountId)

    if (denom) {
      request.setDenom(denom)
    }

    if (transferTypes.length > 0) {
      request.setTransferTypesList(transferTypes)
    }

    try {
      const response = await this.request<
        SubaccountHistoryRequest,
        SubaccountHistoryResponse,
        typeof InjectiveAccountsRPC.SubaccountHistory
      >(request, InjectiveAccountsRPC.SubaccountHistory)

      return response
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

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchOrderStates({
    spotOrderHashes = [],
    derivativeOrderHashes = [],
  }: {
    spotOrderHashes?: string[]
    derivativeOrderHashes?: string[]
  }) {
    const request = new OrderStatesRequest()
    request.setSpotOrderHashesList(spotOrderHashes)
    request.setDerivativeOrderHashesList(derivativeOrderHashes)

    try {
      const response = await this.request<
        OrderStatesRequest,
        OrderStatesResponse,
        typeof InjectiveAccountsRPC.OrderStates
      >(request, InjectiveAccountsRPC.OrderStates)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
