import { AccountMetrics } from '../../../types/metrics'
import {
  ExchangeGrpcAccountTransformer,
  ExchangeGrpcAccountApi,
} from '@injectivelabs/sdk-ts/client/exchange'
import { UiSubaccount } from '../../../types/account'
import { UiAccountTransformer } from '../../../transformers/UiAccountTransformer'
import { ApiOptions } from '../../../types/index'
import { BaseApi } from '../../../BaseApi'

export class UiExchangeGrpcAccountApi extends BaseApi {
  protected client: ExchangeGrpcAccountApi

  constructor(options: ApiOptions) {
    super(options)
    this.client = new ExchangeGrpcAccountApi(options.endpoints.exchangeApi)
  }

  async fetchSubaccounts(address: string): Promise<string[]> {
    const promise = this.client.fetchSubaccountsList(address)
    const response = await this.fetchOrFetchAndMeasure(
      promise,
      AccountMetrics.FetchSubaccount,
    )

    return response.getSubaccountsList()
  }

  async fetchSubaccount(subaccountId: string): Promise<UiSubaccount> {
    const promise = this.client.fetchSubaccountBalancesList(subaccountId)
    const response = await this.fetchOrFetchAndMeasure(
      promise,
      AccountMetrics.FetchSubaccountBalances,
    )
    const grpcBalances = response.getBalancesList()
    const balances =
      ExchangeGrpcAccountTransformer.grpcBalancesToBalances(grpcBalances)
    const uiBalances = balances.map((balance) =>
      UiAccountTransformer.accountBalanceToUiSubaccountBalance(balance),
    )

    return {
      subaccountId,
      balances: uiBalances,
    }
  }

  async fetchSubaccountTransfers(subaccountId: string) {
    const promise = this.client.fetchSubaccountHistory({
      subaccountId,
    })
    const response = await this.fetchOrFetchAndMeasure(
      promise,
      AccountMetrics.FetchSubaccountHistory,
    )
    const subaccountHistory = response.getTransfersList()

    const grpcSubaccountTransfers =
      ExchangeGrpcAccountTransformer.grpcTransferHistoryToTransferHistory(
        subaccountHistory,
      )

    return grpcSubaccountTransfers.map(
      UiAccountTransformer.grpcAccountTransferToUiAccountTransfer,
    )
  }
}
