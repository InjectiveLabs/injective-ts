import { AccountMetrics } from '../../../types/metrics'
import { ExchangeGrpcAccountTransformer } from '@injectivelabs/sdk-ts/client/exchange'
import { Base } from './Base'
import { UiSubaccount } from '../../../types/account'
import { UiAccountTransformer } from '../../../transformers/UiAccountTransformer'

export class UiAccountApi extends Base {
  async fetchSubaccounts(address: string): Promise<string[]> {
    const promise = this.exchangeClient.account.fetchSubaccountsList(address)
    const response = await this.fetchOrFetchAndMeasure(
      promise,
      AccountMetrics.FetchSubaccount,
    )

    return response.getSubaccountsList()
  }

  async fetchSubaccount(subaccountId: string): Promise<UiSubaccount> {
    const promise =
      this.exchangeClient.account.fetchSubaccountBalancesList(subaccountId)
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
    const promise = this.exchangeClient.account.fetchSubaccountHistory({
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
