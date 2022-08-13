import {
  getInjectiveAddress,
  getEip712Tx,
  ChainRestAuthApi,
  ChainRestTendermintApi,
  BaseAccount,
  DEFAULT_STD_FEE,
  hexToBase64,
  hexToBuff,
  // DEFAULT_TIMEOUT_HEIGHT,
} from '@injectivelabs/sdk-ts'
import { recoverTypedSignaturePubKey } from '@injectivelabs/sdk-ts/dist/utils/transaction'
import { Wallet } from '@injectivelabs/ts-types'
import {
  createTransaction,
  createTxRawEIP712,
  createWeb3Extension,
  SIGN_AMINO,
  TxGrpcClient,
} from '@injectivelabs/tx-ts'
// import { BigNumberInBase } from '@injectivelabs/utils'
import { MsgBroadcastOptions, MsgBroadcastTxOptions } from './types'
import { getGasPriceBasedOnMessage } from './utils'

export class MsgBroadcastExperimentalClient {
  public options: MsgBroadcastOptions

  constructor(options: MsgBroadcastOptions) {
    this.options = options
  }

  async broadcast(tx: MsgBroadcastTxOptions) {
    const { options } = this
    const { walletStrategy } = options

    return walletStrategy.wallet === Wallet.Keplr
      ? this.broadcastKeplr(tx)
      : this.broadcastWeb3(tx)
  }

  /**
   * Experimental way to prepare/sign/broadcast transaction using
   * Ethereum native wallets on the client side without
   * the need to use the web3-gateway.
   *
   * @param tx The transaction that needs to be broadcasted
   * @returns transaction hash
   */
  private async broadcastWeb3(tx: MsgBroadcastTxOptions) {
    const { options } = this
    const { walletStrategy, chainId, ethereumChainId } = options
    const msgs = Array.isArray(tx.msgs) ? tx.msgs : [tx.msgs]
    const injectiveAddress = getInjectiveAddress(tx.address)

    /** Account Details **/
    const chainRestAuthApi = new ChainRestAuthApi(
      options.endpoints.sentryHttpApi,
    )
    const accountDetailsResponse = await chainRestAuthApi.fetchAccount(
      injectiveAddress,
    )
    const baseAccount = BaseAccount.fromRestApi(accountDetailsResponse)
    const accountDetails = baseAccount.toAccountDetails()

    /** Block Details */
    const chainRestTendermintApi = new ChainRestTendermintApi(
      options.endpoints.sentryHttpApi,
    )
    const latestBlock = await chainRestTendermintApi.fetchLatestBlock()
    const latestHeight = latestBlock.header.height

    console.log(latestHeight)

    try {
      /** EIP712 for signing on Ethereum wallets */
      const eip712TypedData = getEip712Tx({
        msgs: msgs,
        tx: {
          accountNumber: accountDetails.accountNumber.toString(),
          sequence: accountDetails.sequence.toString(),
          timeoutHeight: '4317',
          chainId: chainId,
        },
        ethereumChainId: ethereumChainId,
      })

      /** Signing on Ethereum */
      const signature = (await walletStrategy.signTransaction(
        JSON.stringify(eip712TypedData),
        tx.address,
      )) as string
      const signatureBuff = hexToBuff(signature)

      /** Get Public Key of the signer */
      const publicKeyHex = recoverTypedSignaturePubKey(
        eip712TypedData,
        signature,
      )
      const publicKeyBase64 = hexToBase64(publicKeyHex)

      /** Preparing the transaction for client broadcasting */
      const txRestClient = new TxGrpcClient(options.endpoints.sentryGrpcApi)
      const { txRaw } = createTransaction({
        message: msgs.map((m) => m.toDirectSign()),
        memo: '',
        signMode: SIGN_AMINO,
        fee: DEFAULT_STD_FEE,
        pubKey: publicKeyBase64,
        sequence: baseAccount.sequence,
        accountNumber: baseAccount.accountNumber,
        chainId: chainId,
      })
      const web3Extension = createWeb3Extension({
        ethereumChainId,
        feePayer: injectiveAddress,
        feePayerSig: signatureBuff,
      })
      const txRawEip712 = createTxRawEIP712(txRaw, web3Extension)

      /** Append Signatures */
      txRawEip712.setSignaturesList([signatureBuff])

      /** Broadcast the transaction */
      const response = await txRestClient.broadcast(txRawEip712)

      if (response.code !== 0) {
        throw new Error(`Transaction failed: ${response.rawLog}`)
      } else {
        return response.txhash
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
