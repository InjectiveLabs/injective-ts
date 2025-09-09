import {
  getNetworkInfo,
  getNetworkEndpoints,
} from '@injectivelabs/networks'
import {
  sleep,
  getStdFee,
  BigNumberInBase,
  DEFAULT_GAS_PRICE,
  DEFAULT_BLOCK_TIMEOUT_HEIGHT,
} from '@injectivelabs/utils'
import {
  GeneralException,
  isThrownException,
  UnspecifiedErrorCode,
  ChainCosmosErrorCode,
  TransactionException,
  TransactionChainErrorModule,
} from '@injectivelabs/exceptions'
import {
  Wallet,
  isCosmosWallet,
  WalletDeviceType,
  isEip712V2OnlyWallet,
  createEip712StdSignDoc,
  isCosmosAminoOnlyWallet,
  getEthereumSignerAddress,
  getInjectiveSignerAddress,
} from '@injectivelabs/wallet-base'
import {
  TxGrpcApi,
  hexToBuff,
  PublicKey,
  SIGN_DIRECT,
  hexToBase64,
  ofacWallets,
  SIGN_EIP712,
  SIGN_EIP712_V2,
  ChainGrpcAuthApi,
  createTxRawEIP712,
  createTransaction,
  ChainGrpcTxFeesApi,
  getAminoStdSignDoc,
  getEip712TypedData,
  createWeb3Extension,
  getEip712TypedDataV2,
  IndexerGrpcWeb3GwApi,
  ChainGrpcTendermintApi,
  getGasPriceBasedOnMessage,
  createTxRawFromSigResponse,
  recoverTypedSignaturePubKey,
  createTransactionWithSigners
} from '@injectivelabs/sdk-ts'
import { checkIfTxRunOutOfGas } from '../utils/index.js'
import {
  WalletStrategyEmitterEventType
} from './types.js'
import type {
  NetworkEndpoints} from '@injectivelabs/networks';
import type {
  ThrownException} from '@injectivelabs/exceptions';
import type { ChainId, EvmChainId } from '@injectivelabs/ts-types'
import type BaseWalletStrategy from '../strategy/BaseWalletStrategy.js'
import type {
  MsgBroadcasterOptions,
  MsgBroadcasterTxOptions,
  MsgBroadcasterTxOptionsWithAddresses} from './types.js';
import type {
  TxResponse,
  CosmosTxV1Beta1Tx,
  DirectSignResponse,
  CreateTransactionWithSignersArgs} from '@injectivelabs/sdk-ts';

const getEthereumWalletPubKey = <T>({
  pubKey,
  eip712TypedData,
  signature,
}: {
  pubKey?: string
  eip712TypedData: T
  signature: string
}) => {
  if (pubKey) {
    return pubKey
  }

  return hexToBase64(recoverTypedSignaturePubKey(eip712TypedData, signature))
}

const defaultRetriesConfig = () => ({
  [`${TransactionChainErrorModule.CosmosSdk}-${ChainCosmosErrorCode.ErrMempoolIsFull}`]:
    {
      retries: 0,
      maxRetries: 10,
      timeout: 1000,
    },
})

/**
 * This class is used to broadcast transactions
 * using the WalletStrategy as a handler
 * for the sign/broadcast flow of the transactions
 *
 * Mainly used for building UI products
 */
export class MsgBroadcaster {
  public options: MsgBroadcasterOptions

  public walletStrategy: BaseWalletStrategy

  public endpoints: NetworkEndpoints

  public chainId: ChainId

  public txTimeout = DEFAULT_BLOCK_TIMEOUT_HEIGHT

  public simulateTx: boolean = true

  public txTimeoutOnFeeDelegation: boolean = false

  public evmChainId?: EvmChainId

  public gasBufferCoefficient: number = 1.2

  public retriesOnError = defaultRetriesConfig()

  public httpHeaders?: Record<string, string>

  constructor(options: MsgBroadcasterOptions) {
    const networkInfo = getNetworkInfo(options.network)

    this.options = options
    this.simulateTx =
      options.simulateTx !== undefined ? options.simulateTx : true
    this.txTimeout = options.txTimeout || DEFAULT_BLOCK_TIMEOUT_HEIGHT
    this.txTimeoutOnFeeDelegation =
      options.txTimeoutOnFeeDelegation !== undefined
        ? options.txTimeoutOnFeeDelegation
        : true
    this.gasBufferCoefficient = options.gasBufferCoefficient || 1.2
    this.chainId = options.chainId || networkInfo.chainId
    this.evmChainId = options.evmChainId || networkInfo.evmChainId
    this.endpoints = options.endpoints || getNetworkEndpoints(options.network)
    this.walletStrategy = options.walletStrategy
    this.httpHeaders = options.httpHeaders
  }

  setOptions(options: Partial<MsgBroadcasterOptions>) {
    this.simulateTx = options.simulateTx || this.simulateTx
    this.txTimeout = options.txTimeout || this.txTimeout
    this.txTimeoutOnFeeDelegation =
      options.txTimeoutOnFeeDelegation || this.txTimeoutOnFeeDelegation
  }

  /**
   * Broadcasting the transaction using the client
   * side approach for both cosmos and ethereum native wallets
   *
   * @param tx
   * @returns {string} transaction hash
   */
  async broadcast(tx: MsgBroadcasterTxOptions) {
    const { walletStrategy } = this
    const txWithAddresses = {
      ...tx,
      ethereumAddress: getEthereumSignerAddress(tx.injectiveAddress),
      injectiveAddress: getInjectiveSignerAddress(tx.injectiveAddress),
    } as MsgBroadcasterTxOptionsWithAddresses

    if (ofacWallets.includes(txWithAddresses.ethereumAddress)) {
      throw new GeneralException(
        new Error('You cannot execute this transaction'),
      )
    }

    try {
      return isCosmosWallet(walletStrategy.wallet)
        ? await this.broadcastDirectSign(txWithAddresses)
        : isEip712V2OnlyWallet(walletStrategy.wallet)
        ? await this.broadcastEip712V2(txWithAddresses)
        : await this.broadcastEip712(txWithAddresses)
    } catch (e) {
      const error = e as any

      walletStrategy.emit(WalletStrategyEmitterEventType.TransactionFail)

      if (isThrownException(error)) {
        throw error
      }

      throw new TransactionException(new Error(error))
    }
  }

  /**
   * Broadcasting the transaction using the client
   * side approach for both cosmos and ethereum native wallets
   * Note: using EIP712_V2 for Ethereum wallets
   *
   * @param tx
   * @returns {string} transaction hash
   */
  async broadcastV2(tx: MsgBroadcasterTxOptions): Promise<TxResponse> {
    const { walletStrategy } = this

    const txWithAddresses = {
      ...tx,
      ethereumAddress: getEthereumSignerAddress(tx.injectiveAddress),
      injectiveAddress: getInjectiveSignerAddress(tx.injectiveAddress),
    } as MsgBroadcasterTxOptionsWithAddresses

    if (ofacWallets.includes(txWithAddresses.ethereumAddress)) {
      throw new GeneralException(
        new Error('You cannot execute this transaction'),
      )
    }

    try {
      return isCosmosWallet(walletStrategy.wallet)
        ? await this.broadcastDirectSign(txWithAddresses)
        : await this.broadcastEip712V2(txWithAddresses)
    } catch (e) {
      const error = e as any

      walletStrategy.emit(WalletStrategyEmitterEventType.TransactionFail)

      if (isThrownException(error)) {
        throw error
      }

      throw new TransactionException(new Error(error))
    }
  }

  /**
   * Broadcasting the transaction using the feeDelegation
   * support approach for both cosmos and ethereum native wallets
   *
   * @param tx
   * @returns {string} transaction hash
   */
  async broadcastWithFeeDelegation(
    tx: MsgBroadcasterTxOptions,
  ): Promise<TxResponse> {
    const { walletStrategy } = this
    const txWithAddresses = {
      ...tx,
      ethereumAddress: getEthereumSignerAddress(tx.injectiveAddress),
      injectiveAddress: getInjectiveSignerAddress(tx.injectiveAddress),
    } as MsgBroadcasterTxOptionsWithAddresses

    if (ofacWallets.includes(txWithAddresses.ethereumAddress)) {
      throw new GeneralException(
        new Error('You cannot execute this transaction'),
      )
    }

    try {
      return isCosmosWallet(walletStrategy.wallet)
        ? await this.broadcastDirectSignWithFeeDelegation(txWithAddresses)
        : await this.broadcastEip712WithFeeDelegation(txWithAddresses)
    } catch (e) {
      const error = e as any

      walletStrategy.emit(WalletStrategyEmitterEventType.TransactionFail)

      if (isThrownException(error)) {
        throw error
      }

      throw new TransactionException(new Error(error))
    }
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
  private async broadcastEip712(tx: MsgBroadcasterTxOptionsWithAddresses) {
    const { chainId, txTimeout, endpoints, evmChainId, walletStrategy } = this
    const msgs = Array.isArray(tx.msgs) ? tx.msgs : [tx.msgs]

    if (!evmChainId) {
      throw new GeneralException(new Error('Please provide evmChainId'))
    }

    /** Account Details * */
    const { baseAccount, latestHeight } =
      await this.fetchAccountAndBlockDetails(tx.injectiveAddress)
    const timeoutHeight = new BigNumberInBase(latestHeight).plus(txTimeout)

    const gas = (tx.gas?.gas || getGasPriceBasedOnMessage(msgs)).toString()
    let stdFee = getStdFee({ ...tx.gas, gas })

    /**
     * Account has not been created on chain
     * and we cannot simulate the transaction
     * to estimate the gas
     **/
    if (!baseAccount.pubKey) {
      stdFee = await this.getStdFeeWithDynamicBaseFee(stdFee)
    } else {
      const { stdFee: simulatedStdFee } = await this.getTxWithSignersAndStdFee({
        chainId,
        signMode: SIGN_EIP712,
        memo: tx.memo,
        message: msgs,
        timeoutHeight: timeoutHeight.toNumber(),
        signers: {
          pubKey: baseAccount.pubKey.key,
          accountNumber: baseAccount.accountNumber,
          sequence: baseAccount.sequence,
        },
        fee: stdFee,
      })

      stdFee = simulatedStdFee
    }

    /** EIP712 for signing on Ethereum wallets */
    const eip712TypedData = getEip712TypedData({
      msgs,
      fee: stdFee,
      tx: {
        memo: tx.memo,
        accountNumber: baseAccount.accountNumber.toString(),
        sequence: baseAccount.sequence.toString(),
        timeoutHeight: timeoutHeight.toFixed(),
        chainId,
      },
      evmChainId,
    })

    /** Signing on Ethereum */
    const signature = await walletStrategy.signEip712TypedData(
      JSON.stringify(eip712TypedData),
      tx.ethereumAddress,
    )

    const pubKeyOrSignatureDerivedPubKey = getEthereumWalletPubKey({
      pubKey: baseAccount.pubKey?.key,
      eip712TypedData,
      signature,
    })

    /** Preparing the transaction for client broadcasting */
    const { txRaw } = createTransaction({
      message: msgs,
      memo: tx.memo,
      signMode: SIGN_EIP712,
      fee: stdFee,
      pubKey: pubKeyOrSignatureDerivedPubKey,
      sequence: baseAccount.sequence,
      timeoutHeight: timeoutHeight.toNumber(),
      accountNumber: baseAccount.accountNumber,
      chainId,
    })

    const web3Extension = createWeb3Extension({
      evmChainId,
    })
    const txRawEip712 = createTxRawEIP712(txRaw, web3Extension)

    /** Append Signatures */
    txRawEip712.signatures = [hexToBuff(signature)]

    const response = await walletStrategy.sendTransaction(txRawEip712, {
      chainId,
      endpoints,
      txTimeout,
      address: tx.injectiveAddress,
    })

    walletStrategy.emit(WalletStrategyEmitterEventType.TransactionBroadcastEnd)

    return await new TxGrpcApi(endpoints.grpc).fetchTxPoll(response.txHash)
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
  private async broadcastEip712V2(
    tx: MsgBroadcasterTxOptionsWithAddresses,
  ): Promise<TxResponse> {
    const { chainId, endpoints, txTimeout, walletStrategy, evmChainId } = this
    const msgs = Array.isArray(tx.msgs) ? tx.msgs : [tx.msgs]

    if (!evmChainId) {
      throw new GeneralException(new Error('Please provide evmChainId'))
    }

    /** Account Details * */
    const { baseAccount, latestHeight } =
      await this.fetchAccountAndBlockDetails(tx.injectiveAddress)
    const timeoutHeight = new BigNumberInBase(latestHeight).plus(txTimeout)

    const gas = (tx.gas?.gas || getGasPriceBasedOnMessage(msgs)).toString()
    let stdFee = getStdFee({ ...tx.gas, gas })

    /**
     * Account has not been created on chain
     * and we cannot simulate the transaction
     * to estimate the gas
     **/
    if (!baseAccount.pubKey) {
      stdFee = await this.getStdFeeWithDynamicBaseFee(stdFee)
    } else {
      const { stdFee: simulatedStdFee } = await this.getTxWithSignersAndStdFee({
        chainId,
        signMode: SIGN_EIP712_V2,
        memo: tx.memo,
        message: msgs,
        timeoutHeight: timeoutHeight.toNumber(),
        signers: {
          pubKey: baseAccount.pubKey.key,
          sequence: baseAccount.sequence,
          accountNumber: baseAccount.accountNumber,
        },
        fee: stdFee,
      })

      stdFee = simulatedStdFee
    }

    walletStrategy.emit(
      WalletStrategyEmitterEventType.TransactionPreparationStart,
    )

    /** EIP712 for signing on Ethereum wallets */
    const eip712TypedData = getEip712TypedDataV2({
      msgs,
      fee: stdFee,
      tx: {
        memo: tx.memo,
        accountNumber: baseAccount.accountNumber.toString(),
        sequence: baseAccount.sequence.toString(),
        timeoutHeight: timeoutHeight.toFixed(),
        chainId,
      },
      evmChainId,
    })

    walletStrategy.emit(
      WalletStrategyEmitterEventType.TransactionPreparationEnd,
    )

    /** Signing on Ethereum */
    const signature = await walletStrategy.signEip712TypedData(
      JSON.stringify(eip712TypedData),
      tx.ethereumAddress,
    )

    const pubKeyOrSignatureDerivedPubKey = getEthereumWalletPubKey({
      pubKey: baseAccount.pubKey?.key,
      eip712TypedData,
      signature,
    })

    walletStrategy.emit(
      WalletStrategyEmitterEventType.TransactionBroadcastStart,
    )

    const { txRaw } = createTransaction({
      message: msgs,
      memo: tx.memo,
      signMode: SIGN_EIP712_V2,
      fee: stdFee,
      pubKey: pubKeyOrSignatureDerivedPubKey,
      sequence: baseAccount.sequence,
      timeoutHeight: timeoutHeight.toNumber(),
      accountNumber: baseAccount.accountNumber,
      chainId,
    })

    const web3Extension = createWeb3Extension({
      evmChainId,
    })
    const txRawEip712 = createTxRawEIP712(txRaw, web3Extension)

    /** Append Signatures */
    txRawEip712.signatures = [hexToBuff(signature)]

    const response = await walletStrategy.sendTransaction(txRawEip712, {
      chainId,
      endpoints,
      txTimeout,
      address: tx.injectiveAddress,
    })

    walletStrategy.emit(WalletStrategyEmitterEventType.TransactionBroadcastEnd)

    return await new TxGrpcApi(endpoints.grpc).fetchTxPoll(response.txHash)
  }

  /**
   * Prepare/sign/broadcast transaction using
   * Ethereum native wallets using the Web3Gateway.
   *
   * @param tx The transaction that needs to be broadcasted
   * @returns transaction hash
   */
  private async broadcastEip712WithFeeDelegation(
    tx: MsgBroadcasterTxOptionsWithAddresses,
  ): Promise<TxResponse> {
    const {
      txTimeout,
      endpoints,
      evmChainId,
      simulateTx,
      httpHeaders,
      walletStrategy,
      txTimeoutOnFeeDelegation,
    } = this
    const msgs = Array.isArray(tx.msgs) ? tx.msgs : [tx.msgs]
    const web3Msgs = msgs.map((msg) => msg.toWeb3())

    if (!evmChainId) {
      throw new GeneralException(new Error('Please provide evmChainId'))
    }

    const transactionApi = new IndexerGrpcWeb3GwApi(
      endpoints.web3gw || endpoints.indexer,
    )

    if (httpHeaders) {
      transactionApi.setMetadata(httpHeaders)
    }

    let timeoutHeight = undefined

    if (txTimeoutOnFeeDelegation) {
      const latestBlock = await new ChainGrpcTendermintApi(
        endpoints.grpc,
      ).fetchLatestBlock()

      const latestHeight = latestBlock!.header!.height

      timeoutHeight = new BigNumberInBase(latestHeight)
        .plus(txTimeout)
        .toNumber()
    }

    walletStrategy.emit(
      WalletStrategyEmitterEventType.TransactionPreparationStart,
    )

    const prepareTxResponse = await transactionApi.prepareTxRequest({
      timeoutHeight,
      memo: tx.memo,
      message: web3Msgs,
      address: tx.ethereumAddress,
      chainId: evmChainId,
      gasLimit: getGasPriceBasedOnMessage(msgs),
      estimateGas: simulateTx,
    })

    walletStrategy.emit(
      WalletStrategyEmitterEventType.TransactionPreparationEnd,
    )

    const signature = await walletStrategy.signEip712TypedData(
      prepareTxResponse.data,
      tx.ethereumAddress,
    )

    const broadcast = async () =>
      await transactionApi.broadcastTxRequest({
        signature,
        message: web3Msgs,
        txResponse: prepareTxResponse,
        chainId: evmChainId,
      })

    try {
      walletStrategy.emit(
        WalletStrategyEmitterEventType.TransactionBroadcastStart,
      )

      const response = await broadcast()

      walletStrategy.emit(
        WalletStrategyEmitterEventType.TransactionBroadcastEnd,
      )

      return await new TxGrpcApi(endpoints.grpc).fetchTxPoll(response.txHash)
    } catch (e) {
      const error = e as any

      if (isThrownException(error)) {
        const exception = error as ThrownException

        /**
         * First MsgExec transaction with a PrivateKey wallet
         * always runs out of gas for some reason, temporary solution
         * to just broadcast the transaction twice
         **/
        if (
          walletStrategy.wallet === Wallet.PrivateKey &&
          checkIfTxRunOutOfGas(exception)
        ) {
          /** Account Details * */
          const accountDetails = await new ChainGrpcAuthApi(
            endpoints.grpc,
          ).fetchAccount(tx.injectiveAddress)
          const { baseAccount } = accountDetails

          /** We only do it on the first account tx fail */
          if (baseAccount.sequence > 1) {
            throw e
          }

          return await this.broadcastEip712WithFeeDelegation(tx)
        }

        return await this.retryOnException(exception, broadcast)
      }

      throw e
    }
  }

  /**
   * Prepare/sign/broadcast transaction using
   * Cosmos native wallets on the client side.
   *
   * @param tx The transaction that needs to be broadcasted
   * @returns transaction hash
   */
  private async broadcastDirectSign(
    tx: MsgBroadcasterTxOptionsWithAddresses,
  ): Promise<TxResponse> {
    const { walletStrategy, txTimeout, endpoints, chainId } = this
    const msgs = Array.isArray(tx.msgs) ? tx.msgs : [tx.msgs]

    /**
     * When using Ledger with Keplr/Leap we have
     * to send EIP712 to sign on Keplr/Leap
     */
    if ([Wallet.Keplr, Wallet.Leap].includes(walletStrategy.getWallet())) {
      const walletDeviceType = await walletStrategy.getWalletDeviceType()
      const isLedgerConnected = walletDeviceType === WalletDeviceType.Hardware

      if (isLedgerConnected) {
        return this.experimentalBroadcastWalletThroughLedger(tx)
      }
    }

    const { baseAccount, latestHeight } =
      await this.fetchAccountAndBlockDetails(tx.injectiveAddress)
    const timeoutHeight = new BigNumberInBase(latestHeight).plus(txTimeout)

    const signMode = isCosmosAminoOnlyWallet(walletStrategy.wallet)
      ? SIGN_EIP712
      : SIGN_DIRECT
    const pubKey = await walletStrategy.getPubKey(tx.injectiveAddress)
    const gas = (tx.gas?.gas || getGasPriceBasedOnMessage(msgs)).toString()

    walletStrategy.emit(
      WalletStrategyEmitterEventType.TransactionPreparationStart,
    )

    /** Prepare the Transaction * */
    const { txRaw } = await this.getTxWithSignersAndStdFee({
      chainId,
      signMode,
      memo: tx.memo,
      message: msgs,
      timeoutHeight: timeoutHeight.toNumber(),
      signers: {
        pubKey,
        accountNumber: baseAccount.accountNumber,
        sequence: baseAccount.sequence,
      },
      fee: getStdFee({ ...tx.gas, gas }),
    })

    walletStrategy.emit(
      WalletStrategyEmitterEventType.TransactionPreparationEnd,
    )

    /** Ledger using Cosmos app only allows signing amino docs */
    if (isCosmosAminoOnlyWallet(walletStrategy.wallet)) {
      const aminoSignDoc = getAminoStdSignDoc({
        ...tx,
        ...baseAccount,
        msgs,
        chainId,
        gas: gas || tx.gas?.gas?.toString(),
        timeoutHeight: timeoutHeight.toFixed(),
      })

      const signResponse = await walletStrategy.signAminoCosmosTransaction({
        signDoc: aminoSignDoc,
        address: tx.injectiveAddress,
      })

      txRaw.signatures = [
        Buffer.from(signResponse.signature.signature, 'base64'),
      ]

      walletStrategy.emit(
        WalletStrategyEmitterEventType.TransactionBroadcastStart,
      )

      const response = await walletStrategy.sendTransaction(txRaw, {
        chainId,
        endpoints,
        txTimeout,
        address: tx.injectiveAddress,
      })

      walletStrategy.emit(
        WalletStrategyEmitterEventType.TransactionBroadcastEnd,
      )

      return await new TxGrpcApi(endpoints.grpc).fetchTxPoll(response.txHash)
    }

    const directSignResponse = (await walletStrategy.signCosmosTransaction({
      txRaw,
      chainId,
      address: tx.injectiveAddress,
      accountNumber: baseAccount.accountNumber,
    })) as DirectSignResponse

    walletStrategy.emit(
      WalletStrategyEmitterEventType.TransactionBroadcastStart,
    )

    const response = await walletStrategy.sendTransaction(directSignResponse, {
      chainId,
      endpoints,
      txTimeout,
      address: tx.injectiveAddress,
    })

    walletStrategy.emit(WalletStrategyEmitterEventType.TransactionBroadcastEnd)

    return await new TxGrpcApi(endpoints.grpc).fetchTxPoll(response.txHash)
  }

  /**
   * We use this method only when we want to broadcast a transaction using Ledger on Keplr/Leap for Injective
   *
   * Note: Gas estimation not available
   * @param tx the transaction that needs to be broadcasted
   */
  private async experimentalBroadcastWalletThroughLedger(
    tx: MsgBroadcasterTxOptionsWithAddresses,
  ) {
    const {
      chainId,
      txTimeout,
      endpoints,
      evmChainId,
      simulateTx,
      walletStrategy,
    } = this
    const msgs = Array.isArray(tx.msgs) ? tx.msgs : [tx.msgs]

    /**
     * We can only use this method
     * when Ledger is connected through Keplr
     */
    if ([Wallet.Keplr, Wallet.Leap].includes(walletStrategy.getWallet())) {
      const walletDeviceType = await walletStrategy.getWalletDeviceType()
      const isLedgerConnected = walletDeviceType === WalletDeviceType.Hardware

      if (!isLedgerConnected) {
        throw new GeneralException(
          new Error(
            `This method can only be used when Ledger is connected through ${walletStrategy.getWallet()}`,
          ),
        )
      }
    }

    if (!evmChainId) {
      throw new GeneralException(new Error('Please provide evmChainId'))
    }

    const cosmosWallet = walletStrategy.getCosmosWallet(chainId)

    const { baseAccount, latestHeight } =
      await this.fetchAccountAndBlockDetails(tx.injectiveAddress)
    const timeoutHeight = new BigNumberInBase(latestHeight).plus(txTimeout)

    const pubKey = await walletStrategy.getPubKey()
    const gas = (tx.gas?.gas || getGasPriceBasedOnMessage(msgs)).toString()

    /** EIP712 for signing on Ethereum wallets */
    const eip712TypedData = getEip712TypedData({
      msgs,
      fee: await this.getStdFeeWithDynamicBaseFee({ ...tx.gas, gas }),
      tx: {
        chainId,
        memo: tx.memo,
        timeoutHeight: timeoutHeight.toFixed(),
        sequence: baseAccount.sequence.toString(),
        accountNumber: baseAccount.accountNumber.toString(),
      },
      evmChainId,
    })

    const aminoSignResponse = await cosmosWallet.signEIP712CosmosTx({
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
      signMode: SIGN_EIP712,
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
    const web3Extension = createWeb3Extension({
      evmChainId,
    })
    const txRawEip712 = createTxRawEIP712(txRaw, web3Extension)

    if (simulateTx) {
      await this.simulateTxRaw(txRawEip712)
    }

    /** Append Signatures */
    const signatureBuff = Buffer.from(
      aminoSignResponse.signature.signature,
      'base64',
    )
    txRawEip712.signatures = [signatureBuff]

    /** Broadcast the transaction */
    const response = await new TxGrpcApi(endpoints.grpc).broadcast(
      txRawEip712,
      { txTimeout },
    )

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
  private async broadcastDirectSignWithFeeDelegation(
    tx: MsgBroadcasterTxOptionsWithAddresses,
  ): Promise<TxResponse> {
    const {
      options,
      chainId,
      txTimeout,
      endpoints,
      httpHeaders,
      walletStrategy,
      txTimeoutOnFeeDelegation,
    } = this
    const msgs = Array.isArray(tx.msgs) ? tx.msgs : [tx.msgs]

    /**
     * We can only use this method when Keplr is connected
     * with ledger
     */
    if (walletStrategy.getWallet() === Wallet.Keplr) {
      const walletDeviceType = await walletStrategy.getWalletDeviceType()
      const isLedgerConnectedOnKeplr =
        walletDeviceType === WalletDeviceType.Hardware

      if (isLedgerConnectedOnKeplr) {
        throw new GeneralException(
          new Error(
            'Keplr + Ledger is not available with fee delegation. Connect with Ledger directly.',
          ),
        )
      }
    }

    const cosmosWallet = walletStrategy.getCosmosWallet(chainId)
    const canDisableCosmosGasCheck = [Wallet.Keplr, Wallet.OWallet].includes(
      walletStrategy.wallet,
    )
    const feePayerPubKey = await this.fetchFeePayerPubKey(
      options.feePayerPubKey,
    )
    const feePayerPublicKey = PublicKey.fromBase64(feePayerPubKey)
    const feePayer = feePayerPublicKey.toAddress().address

    /** Account Details * */
    const { baseAccount, latestHeight } =
      await this.fetchAccountAndBlockDetails(tx.injectiveAddress)

    const chainGrpcAuthApi = new ChainGrpcAuthApi(endpoints.grpc)

    if (httpHeaders) {
      chainGrpcAuthApi.setMetadata(httpHeaders)
    }

    const feePayerAccountDetails = await chainGrpcAuthApi.fetchAccount(feePayer)
    const { baseAccount: feePayerBaseAccount } = feePayerAccountDetails

    const timeoutHeight = new BigNumberInBase(latestHeight).plus(
      txTimeoutOnFeeDelegation ? txTimeout : DEFAULT_BLOCK_TIMEOUT_HEIGHT,
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
          accountNumber: baseAccount.accountNumber,
          sequence: baseAccount.sequence,
        },
        {
          pubKey: feePayerPublicKey.toBase64(),
          accountNumber: feePayerBaseAccount.accountNumber,
          sequence: feePayerBaseAccount.sequence,
        },
      ],
      fee: getStdFee({ ...tx.gas, gas, payer: feePayer }),
    })

    // Temporary remove tx gas check because Keplr doesn't recognize feePayer
    if (canDisableCosmosGasCheck && cosmosWallet.disableGasCheck) {
      cosmosWallet.disableGasCheck(chainId)
    }

    walletStrategy.emit(
      WalletStrategyEmitterEventType.TransactionPreparationStart,
    )

    const directSignResponse = (await walletStrategy.signCosmosTransaction({
      txRaw,
      chainId,
      address: tx.injectiveAddress,
      accountNumber: baseAccount.accountNumber,
    })) as DirectSignResponse

    walletStrategy.emit(
      WalletStrategyEmitterEventType.TransactionPreparationEnd,
    )

    const transactionApi = new IndexerGrpcWeb3GwApi(
      endpoints.web3gw || endpoints.indexer,
    )

    if (httpHeaders) {
      transactionApi.setMetadata(httpHeaders)
    }

    const broadcast = async () =>
      await transactionApi.broadcastCosmosTxRequest({
        address: tx.injectiveAddress,
        txRaw: createTxRawFromSigResponse(directSignResponse),
        signature: directSignResponse.signature.signature,
        pubKey: directSignResponse.signature.pub_key || {
          value: pubKey,
          type: '/injective.crypto.v1beta1.ethsecp256k1.PubKey',
        },
      })

    try {
      walletStrategy.emit(
        WalletStrategyEmitterEventType.TransactionBroadcastStart,
      )

      const response = await broadcast()

      walletStrategy.emit(
        WalletStrategyEmitterEventType.TransactionBroadcastEnd,
      )

      // Re-enable tx gas check removed above
      if (canDisableCosmosGasCheck && cosmosWallet.enableGasCheck) {
        cosmosWallet.enableGasCheck(chainId)
      }

      return await new TxGrpcApi(endpoints.grpc).fetchTxPoll(response.txHash)
    } catch (e) {
      const error = e as any

      if (isThrownException(error)) {
        const exception = error as ThrownException

        return await this.retryOnException(exception, broadcast)
      }

      throw e
    }
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

    const { endpoints, httpHeaders } = this

    const transactionApi = new IndexerGrpcWeb3GwApi(
      endpoints.web3gw || endpoints.indexer,
    )

    if (httpHeaders) {
      transactionApi.setMetadata(httpHeaders)
    }

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

  private async getStdFeeWithDynamicBaseFee(
    args?:
      | string
      | {
          granter?: string
          feePayer?: string
          gasPrice?: string
          gas?: string | number
        },
  ) {
    const client = new ChainGrpcTxFeesApi(this.endpoints.grpc)
    let baseFee = DEFAULT_GAS_PRICE

    try {
      const response = await client.fetchEipBaseFee()
      baseFee = Number(response?.baseFee || DEFAULT_GAS_PRICE)
    } catch {}

    if (!args) {
      return getStdFee(baseFee ? { gasPrice: baseFee } : {})
    }

    if (typeof args === 'string') {
      return getStdFee({
        ...(baseFee && {
          gasPrice: new BigNumberInBase(baseFee).toFixed(),
        }),
        gas: args,
      })
    }

    return getStdFee({
      ...args,
      ...(baseFee && {
        gasPrice: new BigNumberInBase(baseFee).toFixed(),
      }),
    })
  }

  /**
   * In case we don't want to simulate the transaction
   * we get the gas limit based on the message type.
   *
   * If we want to simulate the transaction we set the
   * gas limit based on the simulation and add a small multiplier
   * to be safe (factor of 1.2 as default)
   */
  private async getTxWithSignersAndStdFee(
    args: CreateTransactionWithSignersArgs,
  ) {
    const { simulateTx } = this

    if (!simulateTx) {
      return {
        ...createTransactionWithSigners(args),
        stdFee: await this.getStdFeeWithDynamicBaseFee(args.fee),
      }
    }

    const result = await this.simulateTxWithSigners(args)

    if (!result.gasInfo?.gasUsed) {
      return {
        ...createTransactionWithSigners(args),
        stdFee: await this.getStdFeeWithDynamicBaseFee(args.fee),
      }
    }

    const stdGasFee = {
      ...(await this.getStdFeeWithDynamicBaseFee({
        ...getStdFee(args.fee),
        gas: new BigNumberInBase(result.gasInfo.gasUsed)
          .times(this.gasBufferCoefficient)
          .toFixed(),
      })),
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
    const { endpoints, httpHeaders } = this

    txRaw.signatures = [new Uint8Array(0)]

    const client = new TxGrpcApi(endpoints.grpc)

    if (httpHeaders) {
      client.setMetadata(httpHeaders)
    }

    const simulationResponse = await client.simulate(txRaw)

    return simulationResponse
  }

  /**
   * Create TxRaw and simulate it
   */
  private async simulateTxWithSigners(args: CreateTransactionWithSignersArgs) {
    const { endpoints, httpHeaders } = this
    const { txRaw } = createTransactionWithSigners(args)

    txRaw.signatures = Array(
      Array.isArray(args.signers) ? args.signers.length : 1,
    ).fill(new Uint8Array(0))

    const client = new TxGrpcApi(endpoints.grpc)

    if (httpHeaders) {
      client.setMetadata(httpHeaders)
    }

    const simulationResponse = await client.simulate(txRaw)

    return simulationResponse
  }

  private async retryOnException<T>(
    exception: ThrownException,
    retryLogic: () => Promise<T>,
  ): Promise<any> {
    const errorsToRetry = Object.keys(this.retriesOnError)
    const errorKey =
      `${exception.contextModule}-${exception.contextCode}` as keyof typeof this.retriesOnError

    if (!errorsToRetry.includes(errorKey as string)) {
      throw exception
    }

    const retryConfig = this.retriesOnError[errorKey]

    if (retryConfig.retries >= retryConfig.maxRetries) {
      this.retriesOnError = defaultRetriesConfig()

      throw exception
    }

    await sleep(retryConfig.timeout)

    try {
      retryConfig.retries += 1

      return await retryLogic()
    } catch (e) {
      const error = e as any

      if (isThrownException(error)) {
        return this.retryOnException(error, retryLogic)
      }

      throw e
    }
  }

  private async fetchAccountAndBlockDetails(address: string) {
    const { endpoints, httpHeaders } = this

    const chainClient = new ChainGrpcAuthApi(endpoints.grpc)
    const tendermintClient = new ChainGrpcTendermintApi(endpoints.grpc)

    if (httpHeaders) {
      chainClient.setMetadata(httpHeaders)
      tendermintClient.setMetadata(httpHeaders)
    }

    const accountDetails = await chainClient.fetchAccount(address)
    const { baseAccount } = accountDetails

    const latestBlock = await tendermintClient.fetchLatestBlock()
    const latestHeight = latestBlock!.header!.height

    return {
      baseAccount,
      latestHeight,
      accountDetails,
    }
  }
}
