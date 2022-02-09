import { ChainId } from '@injectivelabs/ts-types'
import { Web3Exception, ExchangeException } from '@injectivelabs/exceptions'
import { Web3Strategy } from '@injectivelabs/web3-strategy'
import { TransactionConsumer } from '@injectivelabs/exchange-consumer'
import { MetricsProvider } from './MetricsProvider'

export interface TxProviderBaseOptions {
  endpoints: {
    exchangeApi: string
  }
  chainId: ChainId
  web3Strategy: Web3Strategy
  metricsProvider?: MetricsProvider
}

export interface TxProviderTransactionOptions {
  bucket: string
  message: any
  address: string
  feePrice?: string
  feeDenom?: string
  gasLimit?: number
}

export class TxProvider {
  private message: any

  private web3Strategy: Web3Strategy

  private metricsProvider?: MetricsProvider

  private chainId: ChainId

  private consumer: TransactionConsumer

  constructor({
    chainId,
    endpoints,
    web3Strategy,
    metricsProvider,
  }: TxProviderBaseOptions) {
    this.consumer = new TransactionConsumer(endpoints.exchangeApi)
    this.web3Strategy = web3Strategy
    this.chainId = chainId
    this.metricsProvider = metricsProvider
  }

  async broadcast(transaction: TxProviderTransactionOptions) {
    const { message, web3Strategy, consumer, chainId, metricsProvider } = this

    const prepareTx = async () => {
      try {
        const promise = consumer.prepareTxRequest({
          ...transaction,
          chainId,
          estimateGas: false,
        })

        if (!metricsProvider) {
          return await promise
        }

        return await metricsProvider.sendAndRecordWithoutProbability(
          promise,
          `${transaction.bucket}PrepareTx`,
        )
      } catch (e: any) {
        throw new ExchangeException(e.message)
      }
    }

    const signTx = async (txData: any) => {
      try {
        const promise = web3Strategy.signTypedDataV4(
          txData,
          transaction.address,
        )

        if (!metricsProvider) {
          return await promise
        }

        return await metricsProvider.sendAndRecordWithoutProbability(
          promise,
          `${transaction.bucket}SignTx`,
        )
      } catch (e: any) {
        throw new Web3Exception(e.message)
      }
    }

    try {
      const txResponse = await prepareTx()
      const signature = await signTx(txResponse.getData())

      const promise = consumer.broadcastTxRequest({
        signature,
        message,
        chainId,
        txResponse,
      })

      if (!metricsProvider) {
        const { txHash } = await promise

        return txHash
      }

      const { txHash } = await metricsProvider.sendAndRecordWithoutProbability(
        promise,
        `${transaction.bucket}BroadcastTx`,
      )

      return txHash
    } catch (e: any) {
      throw new ExchangeException(e.message)
    }
  }
}
