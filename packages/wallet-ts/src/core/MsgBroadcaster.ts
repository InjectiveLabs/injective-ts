import {
  BaseAccount,
  ChainRestAuthApi,
  ChainRestTendermintApi,
  createTransaction,
  createTransactionWithSigners,
  createTxRawEIP712,
  createTxRawFromSigResponse,
  createWeb3Extension,
  DEFAULT_TIMEOUT_HEIGHT,
  getEip712TypedData,
  hexToBase64,
  hexToBuff,
  IndexerGrpcTransactionApi,
  PublicKey,
  SIGN_AMINO,
  TxGrpcClient,
  TxRestClient,
} from '@injectivelabs/sdk-ts'
import { recoverTypedSignaturePubKey } from '@injectivelabs/sdk-ts/dist/utils/transaction'
import type { DirectSignResponse } from '@cosmjs/proto-signing'
import { BigNumberInBase, DEFAULT_STD_FEE } from '@injectivelabs/utils'
import {
  ErrorType,
  GeneralException,
  TransactionException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { TxRaw } from '@injectivelabs/chain-api/cosmos/tx/v1beta1/tx_pb'
import {
  getEthereumSignerAddress,
  getGasPriceBasedOnMessage,
  getInjectiveSignerAddress,
} from './utils'
import {
  MsgBroadcasterOptions,
  MsgBroadcasterTxOptions,
  MsgBroadcasterTxOptionsWithAddresses,
} from './types'
import { isCosmosWallet } from '../cosmos'

/**
 * This class is used to broadcast transactions
 * using the WalletStrategy as a handler
 * for the sign/broadcast flow of the transactions
 *
 * Mainly used for building UI products
 */
export class MsgBroadcaster {
  public options: MsgBroadcasterOptions

  /**
   * Used to interact with the Web3Gateway service
   * to provide feeDelegation support for executing
   * transactions
   */
  public transactionApi: IndexerGrpcTransactionApi

  constructor(options: MsgBroadcasterOptions) {
    this.options = options
    this.transactionApi = new IndexerGrpcTransactionApi(
      options.endpoints.indexerApi,
    )
  }

  /**
   * Broadcasting the transaction using the client
   * side approach for both cosmos and ethereum native wallets
   *
   * @param tx
   * @returns {string} transaction hash
   */
  async broadcast(tx: MsgBroadcasterTxOptions) {
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
    } as MsgBroadcasterTxOptionsWithAddresses

    return isCosmosWallet(walletStrategy.wallet)
      ? this.broadcastCosmos(txWithAddresses)
      : this.broadcastWeb3(txWithAddresses)
  }

  /**
   * Broadcasting the transaction using the client
   * side approach for cosmos native wallets
   * and feeDelegation support approach for ethereum native
   * wallets (default one)
   *
   * @param tx
   * @returns {string} transaction hash
   * @deprecated
   */
  async broadcastOld(tx: MsgBroadcasterTxOptions) {
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
    } as MsgBroadcasterTxOptionsWithAddresses

    return isCosmosWallet(walletStrategy.wallet)
      ? this.broadcastCosmos(txWithAddresses)
      : this.broadcastWeb3WithFeeDelegation(txWithAddresses)
  }

  /**
   * Broadcasting the transaction using the feeDelegation
   * support approach for both cosmos and ethereum native wallets
   *
   * @param tx
   * @returns {string} transaction hash
   */
  async broadcastWithFeeDelegation(tx: MsgBroadcasterTxOptions) {
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
    } as MsgBroadcasterTxOptionsWithAddresses

    return isCosmosWallet(walletStrategy.wallet)
      ? this.broadcastCosmosWithFeeDelegation(txWithAddresses)
      : this.broadcastWeb3WithFeeDelegation(txWithAddresses)
  }

  /**
   * Prepare/sign/broadcast transaction using
   * Ethereum native wallets on the client side.
   *
   * @param tx The transaction that needs to be broadcasted
   * @returns transaction hash
   */
  private async broadcastWeb3(tx: MsgBroadcasterTxOptionsWithAddresses) {
    const { options } = this
    const { walletStrategy, chainId, ethereumChainId } = options
    const msgs = Array.isArray(tx.msgs) ? tx.msgs : [tx.msgs]

    if (!ethereumChainId) {
      throw new GeneralException(new Error('Please provide ethereumChainId'))
    }

    /** Account Details * */
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

    /** EIP712 for signing on Ethereum wallets */
    const eip712TypedData = getEip712TypedData({
      msgs,
      tx: {
        accountNumber: accountDetails.accountNumber.toString(),
        sequence: accountDetails.sequence.toString(),
        timeoutHeight: timeoutHeight.toFixed(),
        chainId,
      },
      ethereumChainId,
    })

    /** Signing on Ethereum */
    const signature = (await walletStrategy.signEip712TypedData(
      JSON.stringify(eip712TypedData),
      tx.ethereumAddress,
    )) as string
    const signatureBuff = hexToBuff(signature)

    /** Get Public Key of the signer */
    const publicKeyHex = recoverTypedSignaturePubKey(eip712TypedData, signature)
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
      timeoutHeight: timeoutHeight.toNumber(),
      accountNumber: baseAccount.accountNumber,
      chainId,
    })

    if (options.simulateTx) {
      await MsgBroadcaster.simulate(
        txRaw,
        new TxGrpcClient(options.endpoints.sentryGrpcApi),
      )
    }

    const web3Extension = createWeb3Extension({
      ethereumChainId,
    })
    const txRawEip712 = createTxRawEIP712(txRaw, web3Extension)

    /** Append Signatures */
    txRawEip712.setSignaturesList([signatureBuff])

    /** Broadcast the transaction */
    const response = await txRestClient.broadcast(txRawEip712)

    if (response.code !== 0) {
      throw new TransactionException(new Error(response.rawLog), {
        code: UnspecifiedErrorCode,
        type: ErrorType.ChainError,
        contextCode: response.code,
      })
    }

    return response.txHash
  }

  /**
   * Prepare/sign/broadcast transaction using
   * Ethereum native wallets using the Web3Gateway.
   *
   * @param tx The transaction that needs to be broadcasted
   * @returns transaction hash
   */
  private async broadcastWeb3WithFeeDelegation(
    tx: MsgBroadcasterTxOptionsWithAddresses,
  ) {
    const { options, transactionApi } = this
    const { walletStrategy, ethereumChainId } = options
    const msgs = Array.isArray(tx.msgs) ? tx.msgs : [tx.msgs]
    const web3Msgs = msgs.map((msg) => msg.toWeb3())

    if (!ethereumChainId) {
      throw new GeneralException(new Error('Please provide ethereumChainId'))
    }

    const txResponse = await transactionApi.prepareTxRequest({
      memo: tx.memo,
      message: web3Msgs,
      address: tx.ethereumAddress,
      chainId: ethereumChainId,
      gasLimit: getGasPriceBasedOnMessage(msgs),
      estimateGas: false,
    })

    const signature = await walletStrategy.signEip712TypedData(
      txResponse.getData(),
      tx.ethereumAddress,
    )

    const response = await transactionApi.broadcastTxRequest({
      signature,
      txResponse,
      message: web3Msgs,
      chainId: ethereumChainId,
    })

    return response.txHash
  }

  /**
   * Prepare/sign/broadcast transaction using
   * Cosmos native wallets on the client side.
   *
   * @param tx The transaction that needs to be broadcasted
   * @returns transaction hash
   */
  private async broadcastCosmos(tx: MsgBroadcasterTxOptionsWithAddresses) {
    const { options } = this
    const { walletStrategy, chainId } = options
    const msgs = Array.isArray(tx.msgs) ? tx.msgs : [tx.msgs]

    /** Account Details * */
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

    const pubKey = await walletStrategy.getPubKey()
    const gas = (tx.gasLimit || getGasPriceBasedOnMessage(msgs)).toString()

    /** Prepare the Transaction * */
    const { txRaw } = createTransactionWithSigners({
      chainId,
      memo: tx.memo || '',
      message: msgs.map((m) => m.toDirectSign()),
      timeoutHeight: timeoutHeight.toNumber(),
      signers: {
        pubKey,
        accountNumber: accountDetails.accountNumber,
        sequence: accountDetails.sequence,
      },
      fee: {
        ...DEFAULT_STD_FEE,
        gas: gas || DEFAULT_STD_FEE.gas,
      },
    })

    if (options.simulateTx) {
      await MsgBroadcaster.simulate(
        txRaw,
        new TxGrpcClient(options.endpoints.sentryGrpcApi),
      )
    }

    const directSignResponse = (await walletStrategy.signCosmosTransaction(
      { txRaw, accountNumber: accountDetails.accountNumber, chainId },
      tx.injectiveAddress,
    )) as DirectSignResponse

    return walletStrategy.sendTransaction(directSignResponse, {
      chainId,
      address: tx.injectiveAddress,
    })
  }

  /**
   * Prepare/sign/broadcast transaction using
   * Cosmos native wallets using the Web3Gateway.
   *
   * @param tx The transaction that needs to be broadcasted
   * @returns transaction hash
   */
  private async broadcastCosmosWithFeeDelegation(
    tx: MsgBroadcasterTxOptionsWithAddresses,
  ) {
    const { options, transactionApi } = this
    const { walletStrategy, chainId } = options
    const msgs = Array.isArray(tx.msgs) ? tx.msgs : [tx.msgs]

    const feePayerPubKey = await this.fetchFeePayerPubKey(
      options.feePayerPubKey,
    )
    const feePayerPublicKey = PublicKey.fromBase64(feePayerPubKey)
    const feePayer = feePayerPublicKey.toAddress().address

    /** Account Details * */
    const chainRestAuthApi = new ChainRestAuthApi(
      options.endpoints.sentryHttpApi,
    )
    const accountDetailsResponse = await chainRestAuthApi.fetchAccount(
      tx.injectiveAddress,
    )
    const baseAccount = BaseAccount.fromRestApi(accountDetailsResponse)
    const accountDetails = baseAccount.toAccountDetails()

    /** Fee Payer Account Details */
    const feePayerAccountDetailsResponse = await chainRestAuthApi.fetchAccount(
      feePayer,
    )
    const feePayerBaseAccount = BaseAccount.fromRestApi(
      feePayerAccountDetailsResponse,
    )
    const feePayerAccountDetails = feePayerBaseAccount.toAccountDetails()

    /** Block Details */
    const chainRestTendermintApi = new ChainRestTendermintApi(
      options.endpoints.sentryHttpApi,
    )
    const latestBlock = await chainRestTendermintApi.fetchLatestBlock()
    const latestHeight = latestBlock.header.height
    const timeoutHeight = new BigNumberInBase(latestHeight).plus(
      DEFAULT_TIMEOUT_HEIGHT,
    )

    const pubKey = await walletStrategy.getPubKey()
    const gas = (tx.gasLimit || getGasPriceBasedOnMessage(msgs)).toString()

    /** Prepare the Transaction * */
    const { txRaw } = createTransactionWithSigners({
      chainId,
      memo: tx.memo || '',
      message: msgs.map((m) => m.toDirectSign()),
      timeoutHeight: timeoutHeight.toNumber(),
      signers: [
        {
          pubKey,
          accountNumber: accountDetails.accountNumber,
          sequence: accountDetails.sequence,
        },
        {
          pubKey: feePayerPublicKey.toBase64(),
          accountNumber: feePayerAccountDetails.accountNumber,
          sequence: feePayerAccountDetails.sequence,
        },
      ],
      fee: {
        ...DEFAULT_STD_FEE,
        gas: gas || DEFAULT_STD_FEE.gas,
        payer: feePayer,
      },
    })

    if (options.simulateTx) {
      await MsgBroadcaster.simulate(
        txRaw,
        new TxGrpcClient(options.endpoints.sentryGrpcApi),
      )
    }

    const directSignResponse = (await walletStrategy.signCosmosTransaction(
      { txRaw, accountNumber: accountDetails.accountNumber, chainId },
      tx.injectiveAddress,
    )) as DirectSignResponse

    const response = await transactionApi.broadcastCosmosTxRequest({
      address: tx.injectiveAddress,
      txRaw: createTxRawFromSigResponse(directSignResponse),
      signature: directSignResponse.signature.signature,
      pubKey: directSignResponse.signature.pub_key,
    })

    return response.txHash
  }

  private async fetchFeePayerPubKey(existingFeePayerPubKey?: string) {
    if (existingFeePayerPubKey) {
      return existingFeePayerPubKey
    }

    const { transactionApi } = this
    const response = await transactionApi.fetchFeePayer()

    if (!response.feePayerPubKey) {
      throw new GeneralException(new Error('Please provide a feePayerPubKey'))
    }

    return response.feePayerPubKey.key
  }

  private static async simulate(
    txRaw: TxRaw,
    txClient: TxGrpcClient | TxRestClient,
  ) {
    try {
      return await txClient.simulate(txRaw)
    } catch (e) {
      throw new TransactionException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.ChainError,
        contextModule: 'simulate-tx',
      })
    }
  }
}
