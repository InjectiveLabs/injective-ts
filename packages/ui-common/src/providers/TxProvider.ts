import { ChainId, ComposerResponse, Wallet } from '@injectivelabs/ts-types'
import { Web3Exception, ExchangeException } from '@injectivelabs/exceptions'
import type { Web3Strategy } from '@injectivelabs/web3-strategy'
import { TransactionConsumer } from '@injectivelabs/exchange-consumer'
import {
  DEFAULT_EXCHANGE_LIMIT,
  DEFAULT_GAS_LIMIT,
  BigNumber,
} from '@injectivelabs/utils'
import type { MetricsProvider } from './MetricsProvider'
import { getInjectiveAddress } from '../utils/helpers'

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
  message: ComposerResponse<any, any>
  memo?: string
  address: string
  feePrice?: string
  feeDenom?: string
  gasLimit?: number
}

const getGasPriceBasedOnMessage = (web3GatewayMessage: any): number => {
  const hasMultipleMessages = Array.isArray(web3GatewayMessage)
  const isExchangeMessage = (message: any) =>
    message['@type'].startsWith('/injective')

  const hasExchangeMessages = Array.isArray(web3GatewayMessage)
    ? web3GatewayMessage.some(isExchangeMessage)
    : isExchangeMessage(web3GatewayMessage)

  return new BigNumber(
    hasExchangeMessages ? DEFAULT_EXCHANGE_LIMIT : DEFAULT_GAS_LIMIT,
  )
    .times(hasMultipleMessages ? web3GatewayMessage.length : 1)
    .toNumber()
}

export class TxProvider {
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
    const { web3Strategy } = this

    return web3Strategy.wallet === Wallet.Keplr
      ? this.broadcastKeplr(transaction)
      : this.broadcastWeb3(transaction)
  }

  private async broadcastWeb3(transaction: TxProviderTransactionOptions) {
    const { web3Strategy, consumer, chainId, metricsProvider } = this

    const prepareTx = async () => {
      try {
        const promise = consumer.prepareTxRequest({
          chainId,
          memo: transaction.memo,
          address: transaction.address,
          message: transaction.message.web3GatewayMessage,
          gasLimit: getGasPriceBasedOnMessage(
            transaction.message.web3GatewayMessage,
          ),
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
        chainId,
        txResponse,
        message: transaction.message.web3GatewayMessage,
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

  private async broadcastKeplr(transaction: TxProviderTransactionOptions) {
    const { web3Strategy, chainId } = this
    const injectiveAddress = getInjectiveAddress(transaction.address)

    try {
      const { directBroadcastMessage } = transaction.message

      const tx = {
        message: {
          type: Array.isArray(directBroadcastMessage)
            ? directBroadcastMessage[0].type
            : directBroadcastMessage.type,
          value: Array.isArray(directBroadcastMessage)
            ? directBroadcastMessage[0].message
            : directBroadcastMessage.message,
        },
        memo: transaction.memo,
      }

      const signResponse = (await web3Strategy.signTypedDataV4(
        tx,
        injectiveAddress,
      )) as any

      return await web3Strategy.sendTransaction(signResponse, {
        chainId,
        address: injectiveAddress,
      })
    } catch (e: any) {
      throw new ExchangeException(e.message)
    }
  }
}
