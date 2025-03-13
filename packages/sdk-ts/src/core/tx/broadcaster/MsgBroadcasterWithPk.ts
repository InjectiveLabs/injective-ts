import { PrivateKey } from '../../accounts/index.js'
import { Msgs } from '../../modules/msgs.js'
import { createTransaction } from '../tx.js'
import { TxGrpcApi } from '../api/TxGrpcApi.js'
import {
  ChainGrpcAuthApi,
  ChainGrpcTendermintApi,
} from '../../../client/chain/grpc/index.js'
import {
  ChainRestAuthApi,
  ChainRestTendermintApi,
} from '../../../client/chain/rest/index.js'
import {
  getStdFee,
  DEFAULT_STD_FEE,
  BigNumberInBase,
  DEFAULT_BLOCK_TIMEOUT_HEIGHT,
} from '@injectivelabs/utils'
import { GeneralException } from '@injectivelabs/exceptions'
import { ChainId, EthereumChainId } from '@injectivelabs/ts-types'
import {
  Network,
  getNetworkInfo,
  getNetworkEndpoints,
  NetworkEndpoints,
} from '@injectivelabs/networks'
import { getGasPriceBasedOnMessage } from '../../../utils/msgs.js'
import { CreateTransactionArgs } from '../types/index.js'
import { IndexerGrpcWeb3GwApi } from '../../../client/index.js'
import { AccountDetails } from '../../../types/auth.js'
import { CosmosTxV1Beta1Tx } from '@injectivelabs/core-proto-ts'
import { ofacWallets } from '../../../json/index.js'

interface MsgBroadcasterTxOptions {
  msgs: Msgs | Msgs[]
  memo?: string
  gas?: {
    gasPrice?: string
    gas?: number /** gas limit */
    feePayer?: string
    granter?: string
  }
}

interface MsgBroadcasterWithPkOptions {
  network?: Network

  /**
   * Only used if we want to override the default
   * endpoints taken from the network param
   */
  endpoints?: {
    indexer: string
    grpc: string
    rest: string
  }
  privateKey: string | PrivateKey /* hex or PrivateKey class */
  ethereumChainId?: EthereumChainId
  chainId?: ChainId
  simulateTx?: boolean
  loggingEnabled?: boolean
  useRest?: boolean
  txTimeout?: number // blocks to wait for tx to be included in a block
  gasBufferCoefficient?: number
  txTimeoutOnFeeDelegation?: boolean
}

/**
 * This class is used to broadcast transactions
 * using a privateKey as a signer
 * for the transactions and broadcasting
 * the transactions directly to the node
 *
 * Mainly used for working in a Node Environment
 */
export class MsgBroadcasterWithPk {
  public endpoints: NetworkEndpoints

  public chainId: ChainId

  public ethereumChainId?: EthereumChainId

  public privateKey: PrivateKey

  public simulateTx: boolean = false

  public txTimeoutOnFeeDelegation: boolean = false

  public useRest: boolean = false

  public gasBufferCoefficient: number = 1.1

  public txTimeout = DEFAULT_BLOCK_TIMEOUT_HEIGHT

  constructor(options: MsgBroadcasterWithPkOptions) {
    const network = options.network || Network.MainnetSentry
    const networkInfo = getNetworkInfo(network)
    const endpoints = getNetworkEndpoints(network)

    this.useRest = options.useRest || false
    this.gasBufferCoefficient = options.gasBufferCoefficient || 1.1
    this.simulateTx = options.simulateTx || false
    this.chainId = options.chainId || networkInfo.chainId
    this.txTimeout = options.txTimeout || DEFAULT_BLOCK_TIMEOUT_HEIGHT
    this.ethereumChainId =
      options.ethereumChainId || networkInfo.ethereumChainId
    this.endpoints = { ...endpoints, ...(options.endpoints || {}) }
    this.privateKey =
      options.privateKey instanceof PrivateKey
        ? options.privateKey
        : PrivateKey.fromHex(options.privateKey)
    this.txTimeoutOnFeeDelegation =
      options.txTimeoutOnFeeDelegation || this.txTimeoutOnFeeDelegation
  }

  /**
   * Broadcasting the transaction using the client
   *
   * @param tx
   * @returns {string} transaction hash
   */
  async broadcast(
    transaction: MsgBroadcasterTxOptions,
    accountDetails?: AccountDetails,
  ) {
    const { privateKey } = this

    if (ofacWallets.includes(privateKey.toHex())) {
      throw new GeneralException(
        new Error('You cannot execute this transaction'),
      )
    }

    const { txRaw } = await this.prepareTxForBroadcast(
      transaction,
      accountDetails,
    )

    return await this.broadcastTxRaw(txRaw)
  }

  /**
   * Broadcasting the transaction with fee delegation services
   *
   * @param tx
   * @returns {string} transaction hash
   */
  async broadcastWithFeeDelegation(transaction: MsgBroadcasterTxOptions) {
    const {
      simulateTx,
      privateKey,
      ethereumChainId,
      endpoints,
      txTimeoutOnFeeDelegation,
      txTimeout,
    } = this

    const ethereumWallet = this.privateKey.toHex()

    if (ofacWallets.includes(ethereumWallet)) {
      throw new GeneralException(
        new Error('You cannot execute this transaction'),
      )
    }

    const msgs = Array.isArray(transaction.msgs)
      ? transaction.msgs
      : [transaction.msgs]

    const tx = {
      ...transaction,
      msgs: msgs,
      ethereumAddress: ethereumWallet,
    } as MsgBroadcasterTxOptions & { ethereumAddress: string }

    const web3Msgs = msgs.map((msg) => msg.toWeb3())

    if (!ethereumChainId) {
      throw new GeneralException(new Error('Please provide ethereumChainId'))
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

    const transactionApi = new IndexerGrpcWeb3GwApi(
      endpoints.web3gw || endpoints.indexer,
    )
    const txResponse = await transactionApi.prepareTxRequest({
      memo: tx.memo,
      message: web3Msgs,
      address: tx.ethereumAddress,
      chainId: ethereumChainId,
      gasLimit: getGasPriceBasedOnMessage(msgs),
      estimateGas: simulateTx || false,
      timeoutHeight,
    })

    const signature = await privateKey.signTypedData(
      JSON.parse(txResponse.data),
    )

    const response = await transactionApi.broadcastTxRequest({
      txResponse,
      message: web3Msgs,
      chainId: ethereumChainId,
      signature: `0x${Buffer.from(signature).toString('hex')}`,
    })

    return await new TxGrpcApi(endpoints.grpc).fetchTxPoll(response.txHash)
  }

  /**
   * Broadcasting the transaction using the client
   *
   * @param tx
   * @returns {string} transaction hash
   */
  async simulate(
    transaction: MsgBroadcasterTxOptions,
    accountDetails?: AccountDetails,
  ) {
    const { privateKey, endpoints, chainId } = this

    const ethereumWallet = this.privateKey.toHex()

    if (ofacWallets.includes(ethereumWallet)) {
      throw new GeneralException(
        new Error('You cannot execute this transaction'),
      )
    }

    const tx = {
      ...transaction,
      msgs: Array.isArray(transaction.msgs)
        ? transaction.msgs
        : [transaction.msgs],
    } as MsgBroadcasterTxOptions

    /** Account Details * */
    const publicKey = privateKey.toPublicKey()
    const actualAccountDetails = await this.getAccountDetails(accountDetails)

    /** Block Details */
    const timeoutHeight = await this.getTimeoutHeight()

    /** Prepare the Transaction * */
    const { txRaw } = createTransaction({
      memo: tx.memo || '',
      fee: DEFAULT_STD_FEE,
      message: tx.msgs as Msgs[],
      timeoutHeight: timeoutHeight.toNumber(),
      pubKey: publicKey.toBase64(),
      sequence: actualAccountDetails.sequence,
      accountNumber: actualAccountDetails.accountNumber,
      chainId: chainId,
    })

    /** Append Blank Signatures */
    txRaw.signatures = [new Uint8Array(0)]

    /** Simulate transaction */
    const simulationResponse = await new TxGrpcApi(endpoints.grpc).simulate(
      txRaw,
    )

    return simulationResponse
  }

  /**
   * In case we don't want to simulate the transaction
   * we get the gas limit based on the message type.
   *
   * If we want to simulate the transaction we set the
   * gas limit based on the simulation and add a small multiplier
   * to be safe (factor of 1.1 (or user specified))
   */
  private async getTxWithStdFee(args: CreateTransactionArgs) {
    const { simulateTx, gasBufferCoefficient } = this

    if (!simulateTx) {
      return createTransaction(args)
    }

    const result = await this.simulateTxRaw(args)

    if (!result.gasInfo?.gasUsed) {
      return createTransaction(args)
    }

    const stdGasFee = getStdFee({
      ...args.fee,
      gas: new BigNumberInBase(result.gasInfo.gasUsed)
        .times(gasBufferCoefficient)
        .toFixed(),
    })

    return createTransaction({ ...args, fee: stdGasFee })
  }

  /**
   * Create TxRaw and simulate it
   */
  private async simulateTxRaw(args: CreateTransactionArgs) {
    const { endpoints } = this
    const { txRaw } = createTransaction(args)

    txRaw.signatures = [new Uint8Array(0)]

    const simulationResponse = await new TxGrpcApi(endpoints.grpc).simulate(
      txRaw,
    )

    return simulationResponse
  }

  private async prepareTxForBroadcast(
    transaction: MsgBroadcasterTxOptions,
    accountDetails?: AccountDetails,
  ) {
    const { chainId, privateKey } = this
    const msgs = Array.isArray(transaction.msgs)
      ? transaction.msgs
      : [transaction.msgs]

    const tx = {
      ...transaction,
      msgs: msgs,
    } as MsgBroadcasterTxOptions

    /** Account Details * */
    const publicKey = privateKey.toPublicKey()
    const actualAccountDetails = await this.getAccountDetails(accountDetails)

    /** Block Details */
    const timeoutHeight = await this.getTimeoutHeight()

    const gas = (
      transaction.gas?.gas || getGasPriceBasedOnMessage(msgs)
    ).toString()

    /** Prepare the Transaction * */
    const { signBytes, txRaw } = await this.getTxWithStdFee({
      memo: tx.memo || '',
      message: msgs,
      fee: getStdFee({ ...tx.gas, gas }),
      timeoutHeight: timeoutHeight.toNumber(),
      pubKey: publicKey.toBase64(),
      sequence: actualAccountDetails.sequence,
      accountNumber: actualAccountDetails.accountNumber,
      chainId: chainId,
    })

    /** Sign transaction */
    const signature = await privateKey.sign(Buffer.from(signBytes))

    /** Append Signatures */
    txRaw.signatures = [signature]

    return { txRaw, accountDetails: actualAccountDetails }
  }

  private async getAccountDetails(
    accountDetails?: AccountDetails,
  ): Promise<AccountDetails> {
    const { useRest } = this

    if (accountDetails) {
      return accountDetails
    }

    if (useRest) {
      const { privateKey, endpoints } = this
      const accountDetailsResponse = await new ChainRestAuthApi(
        endpoints.grpc,
      ).fetchAccount(privateKey.toBech32())
      const baseAccount = accountDetailsResponse.account.base_account

      return {
        accountNumber: parseInt(baseAccount.account_number),
        sequence: parseInt(baseAccount.sequence),
        address: baseAccount.address,
        pubKey: baseAccount.pub_key
          ? {
              key: baseAccount.pub_key.key,
              type: baseAccount.pub_key['@type'],
            }
          : {
              key: '',
              type: '',
            },
      }
    }

    const { privateKey, endpoints } = this
    const accountDetailsResponse = await new ChainGrpcAuthApi(
      endpoints.grpc,
    ).fetchAccount(privateKey.toBech32())
    const baseAccount = accountDetailsResponse.baseAccount

    return {
      accountNumber: baseAccount.accountNumber,
      sequence: baseAccount.sequence,
      address: baseAccount.address,
      pubKey: baseAccount.pubKey
        ? {
            key: baseAccount.pubKey.key,
            type: baseAccount.pubKey.typeUrl,
          }
        : {
            key: '',
            type: '',
          },
    }
  }

  private async getTimeoutHeight() {
    const { useRest, endpoints, txTimeout } = this

    if (useRest) {
      const latestBlock = await new ChainRestTendermintApi(
        endpoints.grpc,
      ).fetchLatestBlock()
      const latestHeight = latestBlock!.header!.height

      return new BigNumberInBase(latestHeight).plus(txTimeout)
    }

    const latestBlock = await new ChainGrpcTendermintApi(
      endpoints.grpc,
    ).fetchLatestBlock()
    const latestHeight = latestBlock!.header!.height

    return new BigNumberInBase(latestHeight).plus(txTimeout)
  }

  private async broadcastTxRaw(txRaw: CosmosTxV1Beta1Tx.TxRaw) {
    const { endpoints, txTimeout } = this
    const txResponse = await new TxGrpcApi(endpoints.grpc).broadcast(txRaw, {
      txTimeout,
    })

    if (txResponse.code !== 0) {
      throw new GeneralException(
        new Error(
          `Transaction failed to be broadcasted - ${txResponse.rawLog} - ${txResponse.txHash}`,
        ),
      )
    }

    return txResponse
  }
}
