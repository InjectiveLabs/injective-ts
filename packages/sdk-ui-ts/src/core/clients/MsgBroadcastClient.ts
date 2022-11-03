import {
  BaseAccount,
  ChainRestAuthApi,
  ChainRestTendermintApi,
  createTransactionWithSigners,
  DEFAULT_TIMEOUT_HEIGHT,
  IndexerGrpcTransactionApi,
} from '@injectivelabs/sdk-ts'
import { isCosmosWallet } from '@injectivelabs/wallet-ts'
import {
  MsgBroadcastOptions,
  MsgBroadcastTxOptions,
  MsgBroadcastTxOptionsWithAddresses,
} from './types'
import {
  getEthereumSignerAddress,
  getGasPriceBasedOnMessage,
  getInjectiveSignerAddress,
} from './utils'
import type { DirectSignResponse } from '@cosmjs/proto-signing'
import { BigNumberInBase, DEFAULT_STD_FEE } from '@injectivelabs/utils'

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
    const txWithAddresses = {
      ...tx,
      ethereumAddress: getEthereumSignerAddress(
        tx.injectiveAddress || tx.address,
      ),
      injectiveAddress: getInjectiveSignerAddress(
        tx.injectiveAddress || tx.address,
      ),
    } as MsgBroadcastTxOptionsWithAddresses

    return isCosmosWallet(walletStrategy.wallet)
      ? this.broadcastCosmos(txWithAddresses)
      : this.broadcastWeb3(txWithAddresses)
  }

  private async broadcastWeb3(tx: MsgBroadcastTxOptionsWithAddresses) {
    const { options, transactionApi } = this
    const { walletStrategy, ethereumChainId, metricsProvider } = options
    const msgs = Array.isArray(tx.msgs) ? tx.msgs : [tx.msgs]
    const web3Msgs = msgs.map((msg) => msg.toWeb3())

    const prepareTx = async () => {
      const promise = transactionApi.prepareTxRequest({
        memo: tx.memo,
        message: web3Msgs,
        address: tx.ethereumAddress,
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
      const promise = walletStrategy.signEip712TypedData(
        txData,
        tx.ethereumAddress,
      )

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

  private async broadcastCosmos(tx: MsgBroadcastTxOptionsWithAddresses) {
    const { options } = this
    const { walletStrategy, chainId } = options
    const msgs = Array.isArray(tx.msgs) ? tx.msgs : [tx.msgs]

    /** Account Details **/
    const chainRestAuthApi = new ChainRestAuthApi(
      options.endpoints.sentryHttpApi,
    )
    const accountDetailsResponse = await chainRestAuthApi.fetchAccount(
      tx.injectiveAddress,
    )
    const baseAccount = BaseAccount.fromRestApi(accountDetailsResponse)
    const accountDetails = baseAccount.toAccountDetails()

    /** Block Details */
    const chainRestTendermintApi = new ChainRestTendermintApi(
      options.endpoints.sentryHttpApi,
    )
    const latestBlock = await chainRestTendermintApi.fetchLatestBlock()
    const latestHeight = latestBlock.header.height
    const timeoutHeight = new BigNumberInBase(latestHeight).plus(
      DEFAULT_TIMEOUT_HEIGHT,
    )

    const gas = (tx.gasLimit || getGasPriceBasedOnMessage(msgs)).toString()

    /** Prepare the Transaction * */
    const { txRaw } = createTransactionWithSigners({
      chainId,
      memo: tx.memo || '',
      message: msgs.map((m) => m.toDirectSign()),
      timeoutHeight: timeoutHeight.toNumber(),
      signers: {
        pubKey: Buffer.from(baseAccount.pubKey.key).toString('base64'),
        accountNumber: accountDetails.accountNumber,
        sequence: accountDetails.sequence,
      },
      fee: {
        ...DEFAULT_STD_FEE,
        gas: gas || DEFAULT_STD_FEE.gas,
      },
    })

    const directSignResponse = (await walletStrategy.signTransaction(
      { txRaw: txRaw, accountNumber: accountDetails.accountNumber, chainId },
      tx.injectiveAddress,
    )) as DirectSignResponse

    return await walletStrategy.sendTransaction(directSignResponse, {
      chainId,
      address: tx.injectiveAddress,
    })
  }
}
