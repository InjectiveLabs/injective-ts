import {
  TxGrpcApi,
  hexToBuff,
  PublicKey,
  SIGN_DIRECT,
  TxResponse,
  hexToBase64,
  ofacWallets,
  SIGN_EIP712_V2,
  SIGN_EIP712,
  ChainGrpcAuthApi,
  CosmosTxV1Beta1Tx,
  createTxRawEIP712,
  createTransaction,
  getAminoStdSignDoc,
  getEip712TypedData,
  createWeb3Extension,
  getEip712TypedDataV2,
  ChainGrpcTendermintApi,
  createTransactionWithSigners,
  createTxRawFromSigResponse,
  IndexerGrpcTransactionApi,
  getGasPriceBasedOnMessage,
  recoverTypedSignaturePubKey,
  CreateTransactionWithSignersArgs,
} from '@injectivelabs/sdk-ts'
import type { DirectSignResponse } from '@cosmjs/proto-signing'
import {
  getStdFee,
  BigNumberInBase,
  DEFAULT_BLOCK_TIMEOUT_HEIGHT,
} from '@injectivelabs/utils'
import {
  ChainCosmosErrorCode,
  GeneralException,
  isThrownException,
  ThrownException,
  TransactionChainErrorModule,
  TransactionException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import {
  getNetworkInfo,
  NetworkEndpoints,
  getNetworkEndpoints,
} from '@injectivelabs/networks'
import { ChainId, EthereumChainId } from '@injectivelabs/ts-types'
import {
  getEthereumSignerAddress,
  getInjectiveSignerAddress,
} from '../utils/utils.js'
import {
  MsgBroadcasterOptions,
  MsgBroadcasterTxOptions,
  MsgBroadcasterTxOptionsWithAddresses,
} from './types.js'
import {
  isCosmosWallet,
  isEip712V2OnlyWallet,
} from '../strategies/wallet-strategy/utils.js'
import { Wallet, WalletDeviceType } from '../types/index.js'
import {
  createEip712StdSignDoc,
  KeplrWallet,
} from '../utils/wallets/keplr/index.js'
import { isCosmosAminoOnlyWallet } from '../utils/index.js'
import { LeapWallet } from '../utils/wallets/index.js'
import { checkIfTxRunOutOfGas } from './helper.js'

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

  public endpoints: NetworkEndpoints

  public chainId: ChainId

  public txTimeout = DEFAULT_BLOCK_TIMEOUT_HEIGHT

  public simulateTx: boolean = true

  public txTimeoutOnFeeDelegation: boolean = false

  public ethereumChainId?: EthereumChainId

  public gasBufferCoefficient: number = 1.2

  public retriesOnError = defaultRetriesConfig()

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
    this.ethereumChainId =
      options.ethereumChainId || networkInfo.ethereumChainId
    this.endpoints = options.endpoints || getNetworkEndpoints(options.network)
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

    if (ofacWallets.includes(txWithAddresses.ethereumAddress)) {
      throw new GeneralException(
        new Error('You cannot execute this transaction'),
      )
    }

    try {
      return isCosmosWallet(walletStrategy.wallet)
        ? this.broadcastCosmos(txWithAddresses)
        : isEip712V2OnlyWallet(walletStrategy.wallet)
        ? this.broadcastWeb3V2(txWithAddresses)
        : this.broadcastWeb3(txWithAddresses)
    } catch (e) {
      const error = e as any

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
  async broadcastV2(tx: MsgBroadcasterTxOptions) {
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

    if (ofacWallets.includes(txWithAddresses.ethereumAddress)) {
      throw new GeneralException(
        new Error('You cannot execute this transaction'),
      )
    }

    try {
      return isCosmosWallet(walletStrategy.wallet)
        ? this.broadcastCosmos(txWithAddresses)
        : this.broadcastWeb3V2(txWithAddresses)
    } catch (e) {
      const error = e as any

      if (isThrownException(error)) {
        throw error
      }

      throw new TransactionException(new Error(error))
    }
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

    if (ofacWallets.includes(txWithAddresses.ethereumAddress)) {
      throw new GeneralException(
        new Error('You cannot execute this transaction'),
      )
    }

    return isCosmosWallet(walletStrategy.wallet)
      ? this.broadcastCosmos(txWithAddresses)
      : this.broadcastWeb3WithFeeDelegation(txWithAddresses)
  }

  /**
   * Broadcasting the transaction using the feeDelegation
   * support approach for both cosmos and ethereum native wallets
   *
   * @param tx
   * @returns {TxResponse}
   */
  async broadcastWithFeeDelegation(
    tx: MsgBroadcasterTxOptions,
  ): Promise<TxResponse> {
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

    if (ofacWallets.includes(txWithAddresses.ethereumAddress)) {
      throw new GeneralException(
        new Error('You cannot execute this transaction'),
      )
    }

    try {
      return isCosmosWallet(walletStrategy.wallet)
        ? this.broadcastCosmosWithFeeDelegation(txWithAddresses)
        : this.broadcastWeb3WithFeeDelegation(txWithAddresses)
    } catch (e) {
      const error = e as any

      if (isThrownException(error)) {
        return this.retryOnException(error, () =>
          this.broadcastWithFeeDelegation(tx),
        )
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
  private async broadcastWeb3(tx: MsgBroadcasterTxOptionsWithAddresses) {
    const { options, chainId, txTimeout, endpoints, ethereumChainId } = this
    const { walletStrategy } = options
    const msgs = Array.isArray(tx.msgs) ? tx.msgs : [tx.msgs]

    if (!ethereumChainId) {
      throw new GeneralException(new Error('Please provide ethereumChainId'))
    }

    /** Account Details * */
    const accountDetails = await new ChainGrpcAuthApi(
      endpoints.grpc,
    ).fetchAccount(tx.injectiveAddress)
    const { baseAccount } = accountDetails

    /** Block Details */
    const latestBlock = await new ChainGrpcTendermintApi(
      endpoints.grpc,
    ).fetchLatestBlock()
    const latestHeight = latestBlock!.header!.height
    const timeoutHeight = new BigNumberInBase(latestHeight).plus(txTimeout)

    const gas = (tx.gas?.gas || getGasPriceBasedOnMessage(msgs)).toString()
    let stdFee = getStdFee({ ...tx.gas, gas })

    /**
     * Account has been created on chain
     * and we can simulate the transaction
     * to estimate the gas
     **/
    if (baseAccount.pubKey) {
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
      ethereumChainId,
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
      ethereumChainId,
    })
    const txRawEip712 = createTxRawEIP712(txRaw, web3Extension)

    /** Append Signatures */
    txRawEip712.signatures = [hexToBuff(signature)]

    return walletStrategy.sendTransaction(txRawEip712, {
      chainId,
      endpoints,
      txTimeout,
      address: tx.injectiveAddress,
    })
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
  private async broadcastWeb3V2(tx: MsgBroadcasterTxOptionsWithAddresses) {
    const { options, chainId, txTimeout, endpoints, ethereumChainId } = this
    const { walletStrategy } = options
    const msgs = Array.isArray(tx.msgs) ? tx.msgs : [tx.msgs]

    if (!ethereumChainId) {
      throw new GeneralException(new Error('Please provide ethereumChainId'))
    }

    /** Account Details * */
    const accountDetails = await new ChainGrpcAuthApi(
      endpoints.grpc,
    ).fetchAccount(tx.injectiveAddress)
    const { baseAccount } = accountDetails

    /** Block Details */
    const latestBlock = await new ChainGrpcTendermintApi(
      endpoints.grpc,
    ).fetchLatestBlock()
    const latestHeight = latestBlock!.header!.height
    const timeoutHeight = new BigNumberInBase(latestHeight).plus(txTimeout)

    const gas = (tx.gas?.gas || getGasPriceBasedOnMessage(msgs)).toString()
    let stdFee = getStdFee({ ...tx.gas, gas })

    /**
     * Account has been created on chain
     * and we can simulate the transaction
     * to estimate the gas
     **/
    if (baseAccount.pubKey) {
      const { stdFee: simulatedStdFee } = await this.getTxWithSignersAndStdFee({
        chainId,
        signMode: SIGN_EIP712_V2,
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
      ethereumChainId,
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
      ethereumChainId,
    })
    const txRawEip712 = createTxRawEIP712(txRaw, web3Extension)

    /** Append Signatures */
    txRawEip712.signatures = [hexToBuff(signature)]

    return walletStrategy.sendTransaction(txRawEip712, {
      chainId,
      endpoints,
      txTimeout,
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
  ): Promise<TxResponse> {
    const {
      options,
      txTimeout,
      endpoints,
      simulateTx,
      ethereumChainId,
      txTimeoutOnFeeDelegation,
    } = this
    const { walletStrategy } = options
    const msgs = Array.isArray(tx.msgs) ? tx.msgs : [tx.msgs]
    const web3Msgs = msgs.map((msg) => msg.toWeb3())

    if (!ethereumChainId) {
      throw new GeneralException(new Error('Please provide ethereumChainId'))
    }

    const transactionApi = new IndexerGrpcTransactionApi(
      endpoints.web3gw || endpoints.indexer,
    )

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

    const txResponse = await transactionApi.prepareTxRequest({
      timeoutHeight,
      memo: tx.memo,
      message: web3Msgs,
      address: tx.ethereumAddress,
      chainId: ethereumChainId,
      gasLimit: getGasPriceBasedOnMessage(msgs),
      estimateGas: simulateTx,
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

    try {
      const txResponse = await new TxGrpcApi(endpoints.grpc).fetchTxPoll(
        response.txHash,
      )

      return txResponse
    } catch (e) {
      /**
       * First MsgExec transaction with a PrivateKey wallet
       * always runs out of gas for some reason, temporary solution
       * to just broadcast the transaction twice
       **/
      if (
        walletStrategy.wallet === Wallet.PrivateKey &&
        checkIfTxRunOutOfGas(e)
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

        return await this.broadcastWeb3WithFeeDelegation(tx)
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
  private async broadcastCosmos(tx: MsgBroadcasterTxOptionsWithAddresses) {
    const { options, txTimeout, endpoints, chainId } = this
    const { walletStrategy } = options
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

    /** Account Details * */
    const accountDetails = await new ChainGrpcAuthApi(
      endpoints.grpc,
    ).fetchAccount(tx.injectiveAddress)
    const { baseAccount } = accountDetails

    /** Block Details */
    const latestBlock = await new ChainGrpcTendermintApi(
      endpoints.grpc,
    ).fetchLatestBlock()
    const latestHeight = latestBlock!.header!.height
    const timeoutHeight = new BigNumberInBase(latestHeight).plus(txTimeout)

    const signMode = isCosmosAminoOnlyWallet(walletStrategy.wallet)
      ? SIGN_EIP712
      : SIGN_DIRECT
    const pubKey = await walletStrategy.getPubKey(tx.injectiveAddress)
    const gas = (tx.gas?.gas || getGasPriceBasedOnMessage(msgs)).toString()

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

      const signature = (await walletStrategy.signAminoCosmosTransaction({
        signDoc: aminoSignDoc,
        chainId,
        address: tx.injectiveAddress,
        accountNumber: baseAccount.accountNumber,
      })) as string

      txRaw.signatures = [Buffer.from(signature, 'base64')]

      return walletStrategy.sendTransaction(txRaw, {
        chainId,
        endpoints,
        txTimeout,
        address: tx.injectiveAddress,
      })
    }

    const directSignResponse = (await walletStrategy.signCosmosTransaction({
      txRaw,
      chainId,
      address: tx.injectiveAddress,
      accountNumber: baseAccount.accountNumber,
    })) as DirectSignResponse

    return walletStrategy.sendTransaction(directSignResponse, {
      chainId,
      endpoints,
      txTimeout,
      address: tx.injectiveAddress,
    })
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
      options,
      chainId,
      txTimeout,
      endpoints,
      simulateTx,
      ethereumChainId,
    } = this
    const { walletStrategy } = options
    const msgs = Array.isArray(tx.msgs) ? tx.msgs : [tx.msgs]

    /**
     * We can NOT use this method
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

    if (!ethereumChainId) {
      throw new GeneralException(new Error('Please provide ethereumChainId'))
    }

    const wallet =
      walletStrategy.getWallet() === Wallet.Keplr
        ? new KeplrWallet(chainId)
        : new LeapWallet(chainId)

    /** Account Details * */
    const accountDetails = await new ChainGrpcAuthApi(
      endpoints.grpc,
    ).fetchAccount(tx.injectiveAddress)
    const { baseAccount } = accountDetails

    /** Block Details */
    const latestBlock = await new ChainGrpcTendermintApi(
      endpoints.grpc,
    ).fetchLatestBlock()
    const latestHeight = latestBlock!.header!.height
    const timeoutHeight = new BigNumberInBase(latestHeight).plus(txTimeout)

    const pubKey = await walletStrategy.getPubKey()
    const gas = (tx.gas?.gas || getGasPriceBasedOnMessage(msgs)).toString()

    /** EIP712 for signing on Ethereum wallets */
    const eip712TypedData = getEip712TypedData({
      msgs,
      fee: getStdFee({ ...tx.gas, gas }),
      tx: {
        memo: tx.memo,
        accountNumber: baseAccount.accountNumber.toString(),
        sequence: baseAccount.sequence.toString(),
        timeoutHeight: timeoutHeight.toFixed(),
        chainId,
      },
      ethereumChainId,
    })

    const aminoSignResponse = await wallet.signEIP712CosmosTx({
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
      ethereumChainId,
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
  private async broadcastCosmosWithFeeDelegation(
    tx: MsgBroadcasterTxOptionsWithAddresses,
  ) {
    const { options, chainId, txTimeout, endpoints, txTimeoutOnFeeDelegation } =
      this
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

      if (isLedgerConnectedOnKeplr) {
        throw new GeneralException(
          new Error(
            'Keplr + Ledger is not available with fee delegation. Connect with Ledger directly.',
          ),
        )
      }
    }

    const feePayerPubKey = await this.fetchFeePayerPubKey(
      options.feePayerPubKey,
    )
    const feePayerPublicKey = PublicKey.fromBase64(feePayerPubKey)
    const feePayer = feePayerPublicKey.toAddress().address

    /** Account Details * */
    const chainGrpcAuthApi = new ChainGrpcAuthApi(endpoints.grpc)
    const accountDetails = await chainGrpcAuthApi.fetchAccount(
      tx.injectiveAddress,
    )
    const feePayerAccountDetails = await chainGrpcAuthApi.fetchAccount(feePayer)

    const { baseAccount } = accountDetails
    const { baseAccount: feePayerBaseAccount } = feePayerAccountDetails

    /** Block Details */
    const latestBlock = await new ChainGrpcTendermintApi(
      endpoints.grpc,
    ).fetchLatestBlock()
    const latestHeight = latestBlock!.header!.height
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
    if (walletStrategy.wallet === Wallet.Keplr) {
      new KeplrWallet(chainId).disableGasCheck()
    }

    const directSignResponse = (await walletStrategy.signCosmosTransaction({
      txRaw,
      chainId,
      address: tx.injectiveAddress,
      accountNumber: baseAccount.accountNumber,
    })) as DirectSignResponse

    const transactionApi = new IndexerGrpcTransactionApi(
      endpoints.web3gw || endpoints.indexer,
    )
    const response = await transactionApi.broadcastCosmosTxRequest({
      address: tx.injectiveAddress,
      txRaw: createTxRawFromSigResponse(directSignResponse),
      signature: directSignResponse.signature.signature,
      pubKey: directSignResponse.signature.pub_key || {
        value: pubKey,
        type: '/injective.crypto.v1beta1.ethsecp256k1.PubKey',
      },
    })

    // Re-enable tx gas check removed above
    if (walletStrategy.wallet === Wallet.Keplr) {
      new KeplrWallet(chainId).enableGasCheck()
    }

    return await new TxGrpcApi(endpoints.grpc).fetchTxPoll(response.txHash)
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

    const { endpoints } = this

    const transactionApi = new IndexerGrpcTransactionApi(
      endpoints.web3gw || endpoints.indexer,
    )
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
   * to be safe (factor of 1.2 as default)
   */
  private async getTxWithSignersAndStdFee(
    args: CreateTransactionWithSignersArgs,
  ) {
    const { simulateTx } = this

    if (!simulateTx) {
      return {
        ...createTransactionWithSigners(args),
        stdFee: getStdFee(args.fee),
      }
    }

    const result = await this.simulateTxWithSigners(args)

    if (!result.gasInfo?.gasUsed) {
      return {
        ...createTransactionWithSigners(args),
        stdFee: getStdFee(args.fee),
      }
    }

    const stdGasFee = {
      ...getStdFee({
        ...getStdFee(args.fee),
        gas: new BigNumberInBase(result.gasInfo.gasUsed)
          .times(this.gasBufferCoefficient)
          .toFixed(),
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

  private async retryOnException<T>(
    exception: ThrownException,
    retryLogic: () => Promise<T>,
  ): Promise<any> {
    const errorsToRetry = Object.keys(this.retriesOnError)
    const errorKey =
      `${exception.contextModule}-${exception.contextCode}` as keyof typeof this.retriesOnError

    if (!errorsToRetry.includes(errorKey)) {
      throw exception
    }

    const retryConfig = this.retriesOnError[errorKey]

    if (retryConfig.retries >= retryConfig.maxRetries) {
      this.retriesOnError = defaultRetriesConfig()

      throw exception
    }

    retryConfig.retries += 1

    return new Promise((resolve) => {
      setTimeout(async () => {
        resolve(retryLogic())
      }, retryConfig.timeout)
    })
  }
}
