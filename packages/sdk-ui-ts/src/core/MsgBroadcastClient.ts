import { Msgs, getInjectiveAddress } from '@injectivelabs/sdk-ts'
import { ExchangeGrpcTransactionApi } from '@injectivelabs/sdk-ts/dist/client'
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
  useCorrectEIP712Hash: boolean
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

  public transactionApi: ExchangeGrpcTransactionApi

  constructor(options: MsgBroadcastOptions) {
    this.options = options
    // TODO: something like this
    // if options.walletStrategy == TrustWallet {
    //   this.options.useCorrectEIP712Hash = true
    // }
    this.options.useCorrectEIP712Hash = true

    this.transactionApi = new ExchangeGrpcTransactionApi(
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
          useCorrectEIP712Hash: false,
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

      try {
        if (!metricsProvider) {
          const { txHash } = await promise

          return txHash
        }

        const { txHash } =
          await metricsProvider.sendAndRecordWithoutProbability(
            promise,
            `${tx.bucket}BroadcastTx`,
          )
        return txHash
      } catch (e) {
        console.log('e =>', e)
      }
      return ''
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
      const [message] = msgs.map((msg) => msg.toDirectSign())
      const transaction = {
        message,
        memo: tx.memo,
      }

      const { directSignResponse } = (await walletStrategy.signTransaction(
        transaction,
        injectiveAddress,
      )) as any

      return await walletStrategy.sendTransaction(directSignResponse, {
        chainId,
        address: injectiveAddress,
      })
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
