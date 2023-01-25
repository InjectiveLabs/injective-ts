import {
  BaseAccount,
  ChainRestAuthApi,
  ChainRestTendermintApi,
  createTransaction,
  createTransactionWithSigners,
  createTxRawEIP712,
  createTxRawFromSigResponse,
  createWeb3Extension,
  getEip712TypedData,
  hexToBase64,
  hexToBuff,
  IndexerGrpcTransactionApi,
  PublicKey,
  SIGN_AMINO,
  TxGrpcApi,
  TxResponse,
  getGasPriceBasedOnMessage,
  TxRestApi,
} from '@injectivelabs/sdk-ts'
import { recoverTypedSignaturePubKey } from '@injectivelabs/sdk-ts/dist/utils/transaction'
import type { DirectSignResponse } from '@cosmjs/proto-signing'
import {
  BigNumberInBase,
  getStdFee,
  DEFAULT_BLOCK_TIMEOUT_HEIGHT,
} from '@injectivelabs/utils'
import {
  ErrorType,
  GeneralException,
  TransactionException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { TxRaw } from '@injectivelabs/chain-api/cosmos/tx/v1beta1/tx_pb'
import {
  getNetworkEndpoints,
  getNetworkInfo,
  NetworkEndpoints,
} from '@injectivelabs/networks'
import { ChainId, EthereumChainId } from '@injectivelabs/ts-types'
import {
  getEthereumSignerAddress,
  getInjectiveSignerAddress,
} from '../utils/utils'
import {
  MsgBroadcasterOptions,
  MsgBroadcasterTxOptions,
  MsgBroadcasterTxOptionsWithAddresses,
} from './types'
import { isCosmosWallet } from '../utils/wallets/cosmos'
import { Wallet, WalletDeviceType } from '../types'
import { createEip712StdSignDoc, KeplrWallet } from '../utils/wallets/keplr'

/**
 * This class is used to broadcast transactions
 * using the WalletStrategy as a handler
 * for the sign/broadcast flow of the transactions
 *
 * Mainly used for building UI products
 */
export class MsgBroadcaster {
  public options: MsgBroadcasterOptions

  public endpoints: NetworkEndpoints

  public chainId: ChainId

  public ethereumChainId?: EthereumChainId

  /**
   * Used to interact with the Web3Gateway service
   * to provide feeDelegation support for executing
   * transactions
   */
  public transactionApi: IndexerGrpcTransactionApi

  constructor(options: MsgBroadcasterOptions) {
    const networkInfo = getNetworkInfo(options.network)
    const endpoints =
      options.networkEndpoints || getNetworkEndpoints(options.network)

    this.options = options
    this.chainId = networkInfo.chainId
    this.ethereumChainId = networkInfo.ethereumChainId
    this.endpoints = endpoints
    this.transactionApi = new IndexerGrpcTransactionApi(networkInfo.indexer)
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
    const { options, endpoints, chainId, ethereumChainId } = this
    const { walletStrategy } = options
    const msgs = Array.isArray(tx.msgs) ? tx.msgs : [tx.msgs]

    if (!ethereumChainId) {
      throw new GeneralException(new Error('Please provide ethereumChainId'))
    }

    /** Account Details * */
    const chainRestAuthApi = new ChainRestAuthApi(endpoints.rest)
    const accountDetailsResponse = await chainRestAuthApi.fetchAccount(
      tx.injectiveAddress,
    )
    const baseAccount = BaseAccount.fromRestApi(accountDetailsResponse)
    const accountDetails = baseAccount.toAccountDetails()

    /** Block Details */
    const chainRestTendermintApi = new ChainRestTendermintApi(endpoints.rest)
    const latestBlock = await chainRestTendermintApi.fetchLatestBlock()
    const latestHeight = latestBlock.header.height
    const timeoutHeight = new BigNumberInBase(latestHeight).plus(
      DEFAULT_BLOCK_TIMEOUT_HEIGHT,
    )

    const gas = (tx.gasLimit || getGasPriceBasedOnMessage(msgs)).toString()

    /** EIP712 for signing on Ethereum wallets */
    const eip712TypedData = getEip712TypedData({
      msgs,
      fee: getStdFee(gas),
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
    const txApi = new TxGrpcApi(endpoints.grpc)
    const { txRaw } = createTransaction({
      message: msgs.map((m) => m.toDirectSign()),
      memo: tx.memo,
      signMode: SIGN_AMINO,
      fee: getStdFee(gas),
      pubKey: publicKeyBase64,
      sequence: baseAccount.sequence,
      timeoutHeight: timeoutHeight.toNumber(),
      accountNumber: baseAccount.accountNumber,
      chainId,
    })

    const web3Extension = createWeb3Extension({
      ethereumChainId,
    })
    const txRawEip712 = createTxRawEIP712(txRaw, web3Extension)

    /* Simulate Transaction */
    if (options.simulateTx) {
      await MsgBroadcaster.simulate({
        txRaw,
        txClient: txApi,
      })
    }

    /** Append Signatures */
    txRawEip712.setSignaturesList([signatureBuff])

    /** Broadcast the transaction */
    const response = await txApi.broadcast(txRawEip712)

    if (response.code !== 0) {
      throw new TransactionException(new Error(response.rawLog), {
        code: response.code,
        type: ErrorType.ChainError,
        contextCode: response.code,
        contextModule: response.codespace,
      })
    }

    return response
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
    const { options, ethereumChainId, transactionApi } = this
    const { walletStrategy } = options
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

    return {
      ...response,
      gasUsed: 0 /** not available from the API */,
      gasWanted: 0 /** not available from the API */,
    } as TxResponse
  }

  /**
   * Prepare/sign/broadcast transaction using
   * Cosmos native wallets on the client side.
   *
   * @param tx The transaction that needs to be broadcasted
   * @returns transaction hash
   */
  private async broadcastCosmos(tx: MsgBroadcasterTxOptionsWithAddresses) {
    const { options, endpoints, chainId } = this
    const { walletStrategy } = options
    const msgs = Array.isArray(tx.msgs) ? tx.msgs : [tx.msgs]

    /**
     * When using Ledger with Keplr we have
     * to send EIP712 to sign on Keplr
     */
    if (walletStrategy.getWallet() === Wallet.Keplr) {
      const walletDeviceType = await walletStrategy.getWalletDeviceType()
      const isLedgerConnectedOnKeplr =
        walletDeviceType === WalletDeviceType.Hardware

      if (isLedgerConnectedOnKeplr) {
        return this.experimentalBroadcastKeplrWithLedger(tx)
      }
    }

    /** Account Details * */
    const chainRestAuthApi = new ChainRestAuthApi(endpoints.rest)
    const accountDetailsResponse = await chainRestAuthApi.fetchAccount(
      tx.injectiveAddress,
    )
    const baseAccount = BaseAccount.fromRestApi(accountDetailsResponse)
    const accountDetails = baseAccount.toAccountDetails()

    /** Block Details */
    const chainRestTendermintApi = new ChainRestTendermintApi(endpoints.rest)
    const latestBlock = await chainRestTendermintApi.fetchLatestBlock()
    const latestHeight = latestBlock.header.height
    const timeoutHeight = new BigNumberInBase(latestHeight).plus(
      DEFAULT_BLOCK_TIMEOUT_HEIGHT,
    )

    const pubKey = await walletStrategy.getPubKey()
    const gas = (tx.gasLimit || getGasPriceBasedOnMessage(msgs)).toString()

    /** Prepare the Transaction * */
    const { txRaw } = createTransactionWithSigners({
      chainId,
      memo: tx.memo,
      message: msgs.map((m) => m.toDirectSign()),
      timeoutHeight: timeoutHeight.toNumber(),
      signers: {
        pubKey,
        accountNumber: accountDetails.accountNumber,
        sequence: accountDetails.sequence,
      },
      fee: getStdFee(gas),
    })

    /* Simulate Transaction */
    if (options.simulateTx) {
      await MsgBroadcaster.simulate({
        txRaw,
        txClient: new TxGrpcApi(endpoints.grpc),
      })
    }

    const directSignResponse = (await walletStrategy.signCosmosTransaction({
      txRaw,
      chainId,
      address: tx.injectiveAddress,
      accountNumber: accountDetails.accountNumber,
    })) as DirectSignResponse

    return walletStrategy.sendTransaction(directSignResponse, {
      chainId,
      address: tx.injectiveAddress,
    })
  }

  /**
   * We use this method only when we want to broadcast a transaction using Ledger on Keplr for Injective
   *
   * @param tx the transaction that needs to be broadcasted
   */
  private async experimentalBroadcastKeplrWithLedger(
    tx: MsgBroadcasterTxOptionsWithAddresses,
  ) {
    const { options, endpoints, chainId, ethereumChainId } = this
    const { walletStrategy } = options
    const msgs = Array.isArray(tx.msgs) ? tx.msgs : [tx.msgs]

    /**
     * We can only use this method when Keplr is connected
     * with ledger
     */
    if (walletStrategy.getWallet() === Wallet.Keplr) {
      const walletDeviceType = await walletStrategy.getWalletDeviceType()
      const isLedgerConnectedOnKeplr =
        walletDeviceType === WalletDeviceType.Hardware

      if (!isLedgerConnectedOnKeplr) {
        throw new GeneralException(
          new Error(
            'This method can only be used when Keplr is connected with Ledger',
          ),
        )
      }
    }

    if (!ethereumChainId) {
      throw new GeneralException(new Error('Please provide ethereumChainId'))
    }

    const keplrWallet = new KeplrWallet(chainId)
    /** Account Details * */
    const chainRestAuthApi = new ChainRestAuthApi(endpoints.rest)
    const accountDetailsResponse = await chainRestAuthApi.fetchAccount(
      tx.injectiveAddress,
    )
    const baseAccount = BaseAccount.fromRestApi(accountDetailsResponse)
    const accountDetails = baseAccount.toAccountDetails()

    /** Block Details */
    const chainRestTendermintApi = new ChainRestTendermintApi(endpoints.rest)
    const latestBlock = await chainRestTendermintApi.fetchLatestBlock()
    const latestHeight = latestBlock.header.height
    const timeoutHeight = new BigNumberInBase(latestHeight).plus(
      DEFAULT_BLOCK_TIMEOUT_HEIGHT,
    )

    const pubKey = await walletStrategy.getPubKey()
    const gas = (tx.gasLimit || getGasPriceBasedOnMessage(msgs)).toString()

    /** EIP712 for signing on Ethereum wallets */
    const eip712TypedData = getEip712TypedData({
      msgs,
      fee: getStdFee(gas),
      tx: {
        accountNumber: accountDetails.accountNumber.toString(),
        sequence: accountDetails.sequence.toString(),
        timeoutHeight: timeoutHeight.toFixed(),
        chainId,
      },
      ethereumChainId,
    })

    const aminoSignResponse = await keplrWallet.signEIP712CosmosTx({
      eip712: eip712TypedData,
      signDoc: createEip712StdSignDoc({
        ...tx,
        ...baseAccount,
        msgs,
        chainId,
        timeoutHeight: timeoutHeight.toFixed(),
      }),
    })

    /**
     * Create TxRaw from the signed tx that we
     * get as a response in case the user changed the fee/memo
     * on the Keplr popup
     */
    const { txRaw } = createTransaction({
      pubKey,
      message: msgs.map((m) => m.toDirectSign()),
      memo: aminoSignResponse.signed.memo,
      signMode: SIGN_AMINO,
      fee: aminoSignResponse.signed.fee,
      sequence: parseInt(aminoSignResponse.signed.sequence, 10),
      timeoutHeight: parseInt(
        (aminoSignResponse.signed as any).timeout_height,
        10,
      ),
      accountNumber: parseInt(aminoSignResponse.signed.account_number, 10),
      chainId,
    })

    /** Preparing the transaction for client broadcasting */
    const txApi = new TxGrpcApi(endpoints.grpc)
    const web3Extension = createWeb3Extension({
      ethereumChainId,
    })
    const txRawEip712 = createTxRawEIP712(txRaw, web3Extension)

    /* Simulate Transaction */
    if (options.simulateTx) {
      await MsgBroadcaster.simulate({
        txRaw,
        txClient: txApi,
      })
    }

    /** Append Signatures */
    const signatureBuff = Buffer.from(
      aminoSignResponse.signature.signature,
      'base64',
    )
    txRawEip712.setSignaturesList([signatureBuff])

    /** Broadcast the transaction */
    const response = await txApi.broadcast(txRawEip712)

    if (response.code !== 0) {
      throw new TransactionException(new Error(response.rawLog), {
        code: UnspecifiedErrorCode,
        type: ErrorType.ChainError,
        contextCode: response.code,
        contextModule: response.codespace,
      })
    }

    return response
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
    const { options, chainId, endpoints, transactionApi } = this
    const { walletStrategy } = options
    const msgs = Array.isArray(tx.msgs) ? tx.msgs : [tx.msgs]

    const feePayerPubKey = await this.fetchFeePayerPubKey(
      options.feePayerPubKey,
    )
    const feePayerPublicKey = PublicKey.fromBase64(feePayerPubKey)
    const feePayer = feePayerPublicKey.toAddress().address

    /** Account Details * */
    const chainRestAuthApi = new ChainRestAuthApi(endpoints.rest)
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
    const chainRestTendermintApi = new ChainRestTendermintApi(endpoints.rest)
    const latestBlock = await chainRestTendermintApi.fetchLatestBlock()
    const latestHeight = latestBlock.header.height
    const timeoutHeight = new BigNumberInBase(latestHeight).plus(
      DEFAULT_BLOCK_TIMEOUT_HEIGHT,
    )

    const pubKey = await walletStrategy.getPubKey()
    const gas = (tx.gasLimit || getGasPriceBasedOnMessage(msgs)).toString()

    /** Prepare the Transaction * */
    const { txRaw } = createTransactionWithSigners({
      chainId,
      memo: tx.memo,
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
        ...getStdFee(gas),
        payer: feePayer,
      },
    })

    /* Simulate Transaction */
    if (options.simulateTx) {
      await MsgBroadcaster.simulate({
        txRaw,
        txClient: new TxGrpcApi(endpoints.grpc),
      })
    }

    const directSignResponse = (await walletStrategy.signCosmosTransaction({
      txRaw,
      chainId,
      address: tx.injectiveAddress,
      accountNumber: accountDetails.accountNumber,
    })) as DirectSignResponse

    const response = await transactionApi.broadcastCosmosTxRequest({
      address: tx.injectiveAddress,
      txRaw: createTxRawFromSigResponse(directSignResponse),
      signature: directSignResponse.signature.signature,
      pubKey: directSignResponse.signature.pub_key,
    })

    return response
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

  private static async simulate({
    txRaw,
    txClient,
  }: {
    txRaw: TxRaw
    txClient: TxGrpcApi | TxRestApi
  }) {
    const txRawWithSignature = txRaw.clone()
    txRawWithSignature.setSignaturesList([new Uint8Array(0)])

    try {
      return await txClient.simulate(txRawWithSignature)
    } catch (e) {
      throw new TransactionException(new Error((e as any).message))
    }
  }
}
