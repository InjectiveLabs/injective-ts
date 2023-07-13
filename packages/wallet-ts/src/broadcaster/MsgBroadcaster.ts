import {
  TxGrpcApi,
  hexToBuff,
  PublicKey,
  SIGN_AMINO,
  TxResponse,
  hexToBase64,
  BaseAccount,
  ChainRestAuthApi,
  createTxRawEIP712,
  createTransaction,
  getEip712TypedData,
  createWeb3Extension,
  ChainRestTendermintApi,
  createTransactionWithSigners,
  createTxRawFromSigResponse,
  IndexerGrpcTransactionApi,
  getGasPriceBasedOnMessage,
  recoverTypedSignaturePubKey,
  CosmosTxV1Beta1Tx,
  CreateTransactionWithSignersArgs,
} from '@injectivelabs/sdk-ts'
import type { DirectSignResponse } from '@cosmjs/proto-signing'
import {
  getStdFee,
  BigNumberInBase,
  DEFAULT_BLOCK_TIMEOUT_HEIGHT,
} from '@injectivelabs/utils'
import {
  GeneralException,
  TransactionException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
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
    this.transactionApi = new IndexerGrpcTransactionApi(endpoints.indexer)
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
   * Note: Gas estimation not available
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

    const gas = (tx.gas?.gas || getGasPriceBasedOnMessage(msgs)).toString()

    /** EIP712 for signing on Ethereum wallets */
    const eip712TypedData = getEip712TypedData({
      msgs,
      fee: getStdFee({ ...tx.gas, gas }),
      tx: {
        memo: tx.memo,
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
    const { txRaw } = createTransaction({
      message: msgs,
      memo: tx.memo,
      signMode: SIGN_AMINO,
      fee: getStdFee({ ...tx.gas, gas }),
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

    if (options.simulateTx) {
      await this.simulateTxRaw(txRawEip712)
    }

    /** Append Signatures */
    txRawEip712.signatures = [signatureBuff]

    return walletStrategy.sendTransaction(txRawEip712, {
      chainId,
      endpoints,
      address: tx.injectiveAddress,
    })
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
      estimateGas: options.simulateTx || false,
    })

    const signature = await walletStrategy.signEip712TypedData(
      txResponse.data,
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
      data: Buffer.from(response.data).toString(),
      height: parseInt(response.height, 10),
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
    const gas = (tx.gas?.gas || getGasPriceBasedOnMessage(msgs)).toString()

    /** Prepare the Transaction * */
    const { txRaw } = await this.getTxWithSignersAndStdFee({
      chainId,
      memo: tx.memo,
      message: msgs,
      timeoutHeight: timeoutHeight.toNumber(),
      signers: {
        pubKey,
        accountNumber: accountDetails.accountNumber,
        sequence: accountDetails.sequence,
      },
      fee: getStdFee({ ...tx.gas, gas }),
    })

    const directSignResponse = (await walletStrategy.signCosmosTransaction({
      txRaw,
      chainId,
      address: tx.injectiveAddress,
      accountNumber: accountDetails.accountNumber,
    })) as DirectSignResponse

    return walletStrategy.sendTransaction(directSignResponse, {
      chainId,
      endpoints,
      address: tx.injectiveAddress,
    })
  }

  /**
   * We use this method only when we want to broadcast a transaction using Ledger on Keplr for Injective
   *
   * Note: Gas estimation not available
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
    const gas = (tx.gas?.gas || getGasPriceBasedOnMessage(msgs)).toString()

    /** EIP712 for signing on Ethereum wallets */
    const eip712TypedData = getEip712TypedData({
      msgs,
      fee: getStdFee({ ...tx.gas, gas }),
      tx: {
        memo: tx.memo,
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
        gas: gas || tx.gas?.gas?.toString(),
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
      message: msgs,
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

    if (options.simulateTx) {
      await this.simulateTxRaw(txRawEip712)
    }

    /** Append Signatures */
    const signatureBuff = Buffer.from(
      aminoSignResponse.signature.signature,
      'base64',
    )
    txRawEip712.signatures = [signatureBuff]

    /** Broadcast the transaction */
    const response = await txApi.broadcast(txRawEip712)

    if (response.code !== 0) {
      throw new TransactionException(new Error(response.rawLog), {
        code: UnspecifiedErrorCode,
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
    const gas = (tx.gas?.gas || getGasPriceBasedOnMessage(msgs)).toString()

    /** Prepare the Transaction * */
    const { txRaw } = await this.getTxWithSignersAndStdFee({
      chainId,
      memo: tx.memo,
      message: msgs,
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
      fee: getStdFee({ ...tx.gas, gas, payer: feePayer }),
    })

    // Temporary remove tx gas check because Keplr doesn't recognize feePayer
    if (walletStrategy.wallet === Wallet.Keplr) {
      new KeplrWallet(chainId).disableGasCheck()
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

    // Re-enable tx gas check removed above
    if (walletStrategy.wallet === Wallet.Keplr) {
      new KeplrWallet(chainId).enableGasCheck()
    }

    return response
  }

  /**
   * Fetch the fee payer's pub key from the web3 gateway
   *
   * Returns a base64 version of it
   */
  private async fetchFeePayerPubKey(existingFeePayerPubKey?: string) {
    if (existingFeePayerPubKey) {
      return existingFeePayerPubKey
    }

    const { transactionApi } = this
    const response = await transactionApi.fetchFeePayer()

    if (!response.feePayerPubKey) {
      throw new GeneralException(new Error('Please provide a feePayerPubKey'))
    }

    if (
      response.feePayerPubKey.key.startsWith('0x') ||
      response.feePayerPubKey.key.length === 66
    ) {
      return Buffer.from(response.feePayerPubKey.key, 'hex').toString('base64')
    }

    return response.feePayerPubKey.key
  }

  /**
   * In case we don't want to simulate the transaction
   * we get the gas limit based on the message type.
   *
   * If we want to simulate the transaction we set the
   * gas limit based on the simulation and add a small multiplier
   * to be safe (factor of 1.2)
   */
  private async getTxWithSignersAndStdFee(
    args: CreateTransactionWithSignersArgs,
  ) {
    const { options } = this
    const { simulateTx } = options

    if (!simulateTx) {
      return {
        ...createTransactionWithSigners(args),
        stdFee: getStdFee({ ...args.fee }),
      }
    }

    const result = await this.simulateTxWithSigners(args)

    if (!result.gasInfo?.gasUsed) {
      return {
        ...createTransactionWithSigners(args),
        stdFee: getStdFee({ ...args.fee }),
      }
    }

    const stdGasFee = {
      ...getStdFee({
        ...args.fee,
        gas: new BigNumberInBase(result.gasInfo.gasUsed).times(1.2).toFixed(),
      }),
    }

    return {
      ...createTransactionWithSigners({
        ...args,
        fee: stdGasFee,
      }),
      stdFee: stdGasFee,
    }
  }

  /**
   * Create TxRaw and simulate it
   */
  private async simulateTxRaw(txRaw: CosmosTxV1Beta1Tx.TxRaw) {
    const { endpoints } = this

    txRaw.signatures = [new Uint8Array(0)]

    const simulationResponse = await new TxGrpcApi(endpoints.grpc).simulate(
      txRaw,
    )

    return simulationResponse
  }

  /**
   * Create TxRaw and simulate it
   */
  private async simulateTxWithSigners(args: CreateTransactionWithSignersArgs) {
    const { endpoints } = this
    const { txRaw } = createTransactionWithSigners(args)

    txRaw.signatures = Array(
      Array.isArray(args.signers) ? args.signers.length : 1,
    ).fill(new Uint8Array(0))

    const simulationResponse = await new TxGrpcApi(endpoints.grpc).simulate(
      txRaw,
    )

    return simulationResponse
  }
}
