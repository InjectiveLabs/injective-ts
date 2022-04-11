import {
  SubaccountConsumer,
  SubaccountTransformer as BaseSubaccountTransformer,
} from '@injectivelabs/subaccount-consumer'
import { AccountMetrics } from '../../types/metrics'
import { ServiceOptions } from '../../types/index'
import { BaseService } from '../BaseService'
import { SubaccountTransformer } from './transformer'
import { UiSubaccount } from './types'

export class SubaccountService extends BaseService {
  protected consumer: SubaccountConsumer

  constructor(options: ServiceOptions) {
    super(options)
    this.consumer = new SubaccountConsumer(this.endpoints.exchangeApi)
  }

  async fetchSubaccounts(address: string): Promise<string[]> {
    const promise = this.consumer.fetchSubaccounts(address)

    return this.fetchOrFetchAndMeasure(promise, AccountMetrics.FetchSubaccount)
  }

  async fetchSubaccount(subaccountId: string): Promise<UiSubaccount> {
    const promise = this.consumer.fetchSubaccountBalances(subaccountId)
    const balances = await this.fetchOrFetchAndMeasure(
      promise,
      AccountMetrics.FetchSubaccountBalances,
    )

    const uiBalances = balances.map((balance) =>
      SubaccountTransformer.grpcSubaccountBalanceToUiSubaccountBalance(balance),
    )

    return {
      subaccountId,
      balances: uiBalances,
    }
  }

  async fetchSubaccountTransfers(subaccountId: string) {
    const promise = this.consumer.fetchSubaccountHistory(subaccountId)
    const subaccountHistory = await this.fetchOrFetchAndMeasure(
      promise,
      AccountMetrics.FetchSubaccountHistory,
    )

    const grpcSubaccountTransfers =
      BaseSubaccountTransformer.grpcTransferHistoryToTransferHistory(
        subaccountHistory,
      )

    return grpcSubaccountTransfers.map(
      SubaccountTransformer.grpcSubaccountTransferToUiSubaccountTransfer,
    )
  }
}
