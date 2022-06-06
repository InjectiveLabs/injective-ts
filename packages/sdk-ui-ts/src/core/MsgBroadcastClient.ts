import { Msgs } from '@injectivelabs/sdk-ts/dist/core'
import { getInjectiveAddress } from '@injectivelabs/sdk-ts/dist/utils'
import { ChainGrpcTransactionApi } from '@injectivelabs/sdk-ts/dist/client'
import { Wallet } from '@injectivelabs/ts-types'
import { MetricsProvider } from '../classes/MetricsProvider'
import {
  BigNumberInBase,
  DEFAULT_EXCHANGE_LIMIT,
  DEFAULT_GAS_LIMIT,
} from '@injectivelabs/utils'
import { WalletStrategy } from '@injectivelabs/wallet-ts'
import { ChainId, EthereumChainId } from '@injectivelabs/ts-types'

export interface MsgBroadcastTxOptions {
  bucket?: string
  memo?: string
  address: string
  msgs: Msgs | Msgs[]
  feePrice?: string
  feeDenom?: string
  gasLimit?: number
}

export interface MsgBroadcastOptions {
  endpoints: {
    exchangeApi: string
  }
  chainId: ChainId
  ethereumChainId: EthereumChainId
  walletStrategy: WalletStrategy
  metricsProvider?: MetricsProvider
}

const getGasPriceBasedOnMessage = (msgs: Msgs[]): number => {
  const hasMultipleMessages = Array.isArray(msgs)
  const isExchangeMessage = (message: Msgs) =>
    message.toWeb3()['@type'].startsWith('/injective')

  const hasExchangeMessages = Array.isArray(msgs)
    ? msgs.some(isExchangeMessage)
    : isExchangeMessage(msgs)

  return new BigNumberInBase(
    hasExchangeMessages ? DEFAULT_EXCHANGE_LIMIT : DEFAULT_GAS_LIMIT,
  )
    .times(hasMultipleMessages ? msgs.length : 1)
    .toNumber()
}

export class MsgBroadcastClient {
  public options: MsgBroadcastOptions

  public transactionApi: ChainGrpcTransactionApi

  constructor(options: MsgBroadcastOptions) {
    this.options = options
    this.transactionApi = new ChainGrpcTransactionApi(
      options.endpoints.exchangeApi,
    )
  }

  async broadcast(tx: MsgBroadcastTxOptions) {
    const { options } = this
    const { walletStrategy } = options

    return walletStrategy.wallet === Wallet.Keplr
      ? this.broadcastKeplr(tx)
      : this.broadcastWeb3(tx)
  }

  private async broadcastWeb3(tx: MsgBroadcastTxOptions) {
    const { options, transactionApi } = this
    const { walletStrategy, ethereumChainId, metricsProvider } = options
    const msgs = Array.isArray(tx.msgs) ? tx.msgs : [tx.msgs]
    const web3Msgs = msgs.map((msg) => msg.toWeb3())

    const prepareTx = async () => {
      try {
        const promise = transactionApi.prepareTxRequest({
          chainId: ethereumChainId,
          memo: tx.memo,
          address: tx.address,
          message: web3Msgs,
          gasLimit: getGasPriceBasedOnMessage(msgs),
          estimateGas: false,
        })

        if (!metricsProvider) {
          return await promise
        }

        return await metricsProvider.sendAndRecordWithoutProbability(
          promise,
          `${tx.bucket}PrepareTx`,
        )
      } catch (e: any) {
        throw new Error(e.message)
      }
    }

    const signTx = async (txData: any) => {
      try {
        const promise = walletStrategy.signTransaction(txData, tx.address)

        if (!metricsProvider) {
          return await promise
        }

        return await metricsProvider.sendAndRecordWithoutProbability(
          promise,
          `${tx.bucket}SignTx`,
        )
      } catch (e: any) {
        throw new Error(e.message)
      }
    }

    try {
      const txResponse = await prepareTx()
      const signature = await signTx(txResponse.getData())

      const promise = transactionApi.broadcastTxRequest({
        signature,
        txResponse,
        message: web3Msgs,
        chainId: ethereumChainId,
      })

      if (!metricsProvider) {
        const { txHash } = await promise

        return txHash
      }

      const { txHash } = await metricsProvider.sendAndRecordWithoutProbability(
        promise,
        `${tx.bucket}BroadcastTx`,
      )

      return txHash
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  private async broadcastKeplr(tx: MsgBroadcastTxOptions) {
    const { options } = this
    const { walletStrategy, chainId } = options
    const msgs = Array.isArray(tx.msgs) ? tx.msgs : [tx.msgs]
    const injectiveAddress = getInjectiveAddress(tx.address)

    try {
      const [msg] = msgs.map((msg) => msg.toDirectSign())

      const transaction = {
        message: {
          type: msg.type,
          value: msg.message,
        },
        memo: tx.memo,
      }

      const signResponse = (await walletStrategy.signTransaction(
        transaction,
        injectiveAddress,
      )) as any

      return await walletStrategy.sendTransaction(signResponse, {
        chainId,
        address: injectiveAddress,
      })
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
