import {
  getInjectiveAddress,
  IndexerGrpcTransactionApi,
} from '@injectivelabs/sdk-ts'
import { Wallet } from '@injectivelabs/ts-types'
import { MsgBroadcastOptions, MsgBroadcastTxOptions } from './types'
import { getGasPriceBasedOnMessage } from './utils'

export class MsgBroadcastClient {
  public options: MsgBroadcastOptions

  public transactionApi: IndexerGrpcTransactionApi

  constructor(options: MsgBroadcastOptions) {
    this.options = options
    this.transactionApi = new IndexerGrpcTransactionApi(
      options.endpoints.indexerApi,
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
          memo: tx.memo,
          message: web3Msgs,
          address: tx.address,
          chainId: ethereumChainId,
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
      console.log(txResponse.getData())

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
      } catch (e: any) {
        throw new Error(e.message)
      }
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
        gas: tx.gasLimit ? tx.gasLimit : getGasPriceBasedOnMessage(msgs),
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
