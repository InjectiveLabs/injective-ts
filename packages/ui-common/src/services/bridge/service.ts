import {
  BridgeTransactionConsumer,
  BridgeTransactionTransformer,
} from '@injectivelabs/exchange-consumer'
import { subHours, format } from 'date-fns'
import {
  computeLatestTransactions,
  mergeAllTransactions,
  getLatestSelectedTransaction,
  getPeggoGraphQlEndpoint,
} from './utils'
import { ExchangeMetrics, AccountMetrics } from '../../types/metrics'
import { ApolloConsumer } from './gql/client'
import { ServiceOptions } from '../../types'
import { BaseService } from '../BaseService'

export class BridgeService extends BaseService {
  protected consumer: BridgeTransactionConsumer

  protected apolloConsumer: ApolloConsumer

  constructor(options: ServiceOptions) {
    super(options)
    this.consumer = new BridgeTransactionConsumer(this.endpoints.exchangeApi)
    this.apolloConsumer = new ApolloConsumer(
      getPeggoGraphQlEndpoint(options.network),
    )
  }

  static computeLatestTransactions = computeLatestTransactions

  static getLatestSelectedTransaction = getLatestSelectedTransaction

  static mergeAllTransaction = mergeAllTransactions

  async fetchIBCTransferTransactions(address: string) {
    try {
      const promise = this.consumer.fetchIBCTransferTxs({
        sender: address,
        receiver: address,
      })

      const ibcTransferTransactions = await this.fetchOrFetchAndMeasure(
        promise,
        ExchangeMetrics.FetchIBCTransferTxs,
      )

      return ibcTransferTransactions.map(
        BridgeTransactionTransformer.grpcIBCTransferTxToIBCTransferTx,
      )
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchPeggyDepositTransactions({
    sender,
    receiver,
  }: {
    sender: string
    receiver: string
  }) {
    try {
      const promise = this.consumer.fetchPeggyDepositTxs({
        sender,
        receiver,
      })

      const ibcTransferTransactions = await this.fetchOrFetchAndMeasure(
        promise,
        ExchangeMetrics.FetchPeggyDepositTxs,
      )

      return ibcTransferTransactions.map(
        BridgeTransactionTransformer.grpcPeggyDepositTx,
      )
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchPeggyWithdrawalTransactions({
    sender,
    receiver,
  }: {
    sender: string
    receiver: string
  }) {
    try {
      const promise = this.consumer.fetchPeggyWithdrawalTxs({
        sender,
        receiver,
      })
      const ibcTransferTransactions = await this.fetchOrFetchAndMeasure(
        promise,
        ExchangeMetrics.FetchPeggyWithdrawalTxs,
      )

      return ibcTransferTransactions.map(
        BridgeTransactionTransformer.grpcPeggyWithdrawalTx,
      )
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchPeggoUserDeposits(address: string) {
    const timestampHoursSince = 3
    const timestamp = parseInt(
      format(subHours(new Date(), timestampHoursSince), 't'),
      10,
    )

    const promise = this.apolloConsumer.fetchUserBridgeDeposits(
      address,
      timestamp,
    )
    const userDeposits = await this.fetchOrFetchAndMeasure(
      promise,
      AccountMetrics.FetchUserBridgeDepositsGraph,
    )

    return userDeposits
  }
}
