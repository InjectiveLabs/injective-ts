import {
  getInjectiveAddress,
  IndexerGrpcTransactionApi,
} from '@injectivelabs/sdk-ts'
import { Wallet } from '@injectivelabs/wallet-ts'
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

    return [Wallet.Keplr, Wallet.Leap].includes(walletStrategy.wallet)
      ? this.broadcastCosmos(tx)
      : this.broadcastWeb3(tx)
  }

  private async broadcastWeb3(tx: MsgBroadcastTxOptions) {
    const { options, transactionApi } = this
    const { walletStrategy, ethereumChainId, metricsProvider } = options
    const msgs = Array.isArray(tx.msgs) ? tx.msgs : [tx.msgs]
    const web3Msgs = msgs.map((msg) => msg.toWeb3())

    const prepareTx = async () => {
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
    }

    const signTx = async (txData: any) => {
      const promise = walletStrategy.signTransaction(txData, tx.address)

      if (!metricsProvider) {
        return await promise
      }

      return await metricsProvider.sendAndRecordWithoutProbability(
        promise,
        `${tx.bucket}SignTx`,
      )
    }

    const txResponse = await prepareTx()
    const signature = (await signTx(txResponse.getData())) as string

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
  }

  private async broadcastCosmos(tx: MsgBroadcastTxOptions) {
    const { options } = this
    const { walletStrategy, chainId } = options
    const msgs = Array.isArray(tx.msgs) ? tx.msgs : [tx.msgs]
    const injectiveAddress = getInjectiveAddress(tx.address)

    const transaction = {
      message: msgs,
      memo: tx.memo || '',
      gas: (tx.gasLimit || getGasPriceBasedOnMessage(msgs)).toString(),
    }

    const directSignResponse = (await walletStrategy.signTransaction(
      transaction,
      injectiveAddress,
    )) as any

    return await walletStrategy.sendTransaction(directSignResponse, {
      chainId,
      address: injectiveAddress,
    })
  }
}
