import {
  BridgeTransactionConsumer,
  BridgeTransactionTransformer,
} from '@injectivelabs/exchange-consumer'
import { subHours, format } from 'date-fns'
import { UIBridgeTransaction } from './types'
import {
  findEthereumTransactionByNonce,
  findEthereumTransactionByTxHash,
  findEthereumTransactionByTxHashes,
  findIBCTransactionByTimeoutTimestamp,
  getCachedIBCTransactionState,
  ibcTxNotPartOfInjectiveIbcTxs,
  txNotPartOfInjectivePeggyTxs,
  txNotPartOfPeggoDeposit,
} from './utils'
import { BridgeTransformer } from './transformer'
import { MetricsProvider } from '../providers/MetricsProvider'
import { ExchangeMetrics } from '../types/metrics'
import { ApolloConsumer } from '../gql/client'
import { ServiceOptions } from '../types'

export const computeLatestTransactions = ({
  latestTransactions,
  peggoUserDeposits,
  ibcTransferBridgeTransactions,
  peggyDepositBridgeTransactions,
  peggyWithdrawalBridgeTransactions,
}: {
  latestTransactions: UIBridgeTransaction[]
  peggoUserDeposits: UIBridgeTransaction[]
  ibcTransferBridgeTransactions: UIBridgeTransaction[]
  peggyDepositBridgeTransactions: UIBridgeTransaction[]
  peggyWithdrawalBridgeTransactions: UIBridgeTransaction[]
}): UIBridgeTransaction[] => {
  const filteredCachedTransactions = latestTransactions
    .map((transaction: UIBridgeTransaction) => {
      const isEthereumTx =
        transaction.sender.startsWith('0x') ||
        transaction.receiver.startsWith('0x')

      if (isEthereumTx) {
        return transaction
      }

      return {
        ...transaction,
        state: getCachedIBCTransactionState(transaction),
      }
    })
    .filter(ibcTxNotPartOfInjectiveIbcTxs(ibcTransferBridgeTransactions))
    .filter(txNotPartOfPeggoDeposit(peggoUserDeposits))
    .filter(
      txNotPartOfInjectivePeggyTxs([
        ...peggyDepositBridgeTransactions,
        ...peggyWithdrawalBridgeTransactions,
      ]),
    )

  const filteredPeggoUserDeposits = peggoUserDeposits.filter(
    txNotPartOfInjectivePeggyTxs(peggyDepositBridgeTransactions),
  )

  return [
    ...filteredCachedTransactions,
    ...filteredPeggoUserDeposits,
    ...ibcTransferBridgeTransactions,
    ...peggyDepositBridgeTransactions,
    ...peggyWithdrawalBridgeTransactions,
  ]
}

export const getLatestSelectedTransaction = ({
  selectedTransaction,
  peggoUserDeposits,
  latestTransactions,
}: {
  selectedTransaction: UIBridgeTransaction
  peggoUserDeposits: UIBridgeTransaction[]
  latestTransactions: UIBridgeTransaction[]
}): UIBridgeTransaction => {
  if (!selectedTransaction.receiver || !selectedTransaction.sender) {
    return selectedTransaction
  }

  const newSelectedTransaction =
    peggoUserDeposits.find((peggoTransaction) =>
      findEthereumTransactionByTxHash(peggoTransaction, selectedTransaction),
    ) || selectedTransaction

  const selectedTransactionExistInTransactions = latestTransactions.find(
    (transaction: UIBridgeTransaction) =>
      findEthereumTransactionByNonce(transaction, newSelectedTransaction) ||
      findEthereumTransactionByTxHashes(transaction, newSelectedTransaction) ||
      findIBCTransactionByTimeoutTimestamp(transaction, newSelectedTransaction),
  )

  return selectedTransactionExistInTransactions || newSelectedTransaction
}

export class BridgeService {
  private options: ServiceOptions

  private consumer: BridgeTransactionConsumer

  private metricsProvider: MetricsProvider

  private apolloConsumer: ApolloConsumer

  constructor({
    options,
    peggyGraphQlEndpoint,
  }: {
    options: ServiceOptions
    peggyGraphQlEndpoint: string
  }) {
    this.options = options
    this.consumer = new BridgeTransactionConsumer(options.endpoints.exchangeApi)
    this.apolloConsumer = new ApolloConsumer(peggyGraphQlEndpoint)
    this.metricsProvider = new MetricsProvider(options.metrics)
  }

  static computeLatestTransactions = computeLatestTransactions

  static getLatestSelectedTransaction = getLatestSelectedTransaction

  async fetchIBCTransferTransactions(address: string) {
    try {
      const promise = this.consumer.fetchIBCTransferTxs({
        sender: address,
        receiver: address,
      })

      const ibcTransferTransactions = await this.metricsProvider.sendAndRecord(
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

      const ibcTransferTransactions = await this.metricsProvider.sendAndRecord(
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

      const ibcTransferTransactions = await this.metricsProvider.sendAndRecord(
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
    const response = await this.apolloConsumer.fetchUserBridgeDeposits(
      address,
      timestamp,
    )

    return Promise.all(
      response.map(async (transaction) =>
        BridgeTransformer.convertPeggoToUIBridgeTransaction({
          transaction,
          network: this.options.network,
        }),
      ),
    )
  }
}
