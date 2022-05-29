import { AccountAddress } from '@injectivelabs/ts-types'
import {
  SubaccountsListRequest,
  SubaccountsListResponse,
  SubaccountBalanceRequest,
  SubaccountBalanceResponse,
  SubaccountBalancesListRequest,
  SubaccountHistoryRequest,
  SubaccountHistoryResponse,
  SubaccountBalancesListResponse,
  PortfolioRequest,
  PortfolioResponse,
  RewardsRequest,
  RewardsResponse,
} from '@injectivelabs/exchange-api/injective_accounts_rpc_pb'
import { InjectiveAccountsRPC } from '@injectivelabs/exchange-api/injective_accounts_rpc_pb_service'
import { GrpcException } from '@injectivelabs/exceptions'
import BaseConsumer from '../BaseConsumer'

export class SubaccountConsumer extends BaseConsumer {
  async fetchPortfolioValue(address: AccountAddress) {
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
      throw new GrpcException(e.message)
    }
  }

  async fetchRewards(address: string) {
    const request = new RewardsRequest()
    request.setAccountAddress(address)

    try {
      const response = await this.request<
        RewardsRequest,
        RewardsResponse,
        typeof InjectiveAccountsRPC.Rewards
      >(request, InjectiveAccountsRPC.Rewards)

      return response.getRewardsList()
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async fetchSubaccounts(address: AccountAddress) {
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
      throw new GrpcException(e.message)
    }
  }

  async fetchSubaccountBalance(address: AccountAddress, denom: string) {
    const request = new SubaccountBalanceRequest()
    request.setSubaccountId(address)
    request.setDenom(denom)

    try {
      const response = await this.request<
        SubaccountBalanceRequest,
        SubaccountBalanceResponse,
        typeof InjectiveAccountsRPC.SubaccountBalanceEndpoint
      >(request, InjectiveAccountsRPC.SubaccountBalanceEndpoint)

      return response.getBalance()
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async fetchSubaccountBalances(address: AccountAddress) {
    const request = new SubaccountBalancesListRequest()
    request.setSubaccountId(address)

    try {
      const response = await this.request<
        SubaccountBalancesListRequest,
        SubaccountBalancesListResponse,
        typeof InjectiveAccountsRPC.SubaccountBalancesList
      >(request, InjectiveAccountsRPC.SubaccountBalancesList)

      return response.getBalancesList()
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async fetchSubaccountHistory(address: AccountAddress) {
    const request = new SubaccountHistoryRequest()
    request.setSubaccountId(address)

    try {
      const response = await this.request<
        SubaccountHistoryRequest,
        SubaccountHistoryResponse,
        typeof InjectiveAccountsRPC.SubaccountHistory
      >(request, InjectiveAccountsRPC.SubaccountHistory)

      return response.getTransfersList()
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }
}
