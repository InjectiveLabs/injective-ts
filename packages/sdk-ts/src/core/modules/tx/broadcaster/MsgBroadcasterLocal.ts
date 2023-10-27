import { BaseAccount, PrivateKey } from '../../../accounts'
import { Msgs } from '../../msgs'
import { createTransaction } from '../tx'
import { TxGrpcApi } from '../api/TxGrpcApi'
import {
  ChainRestAuthApi,
  ChainRestTendermintApi,
} from '../../../../client/chain/rest'
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
import { getGasPriceBasedOnMessage } from '../../../../utils/msgs'
import { CreateTransactionArgs } from '../types'
import { IndexerGrpcTransactionApi } from '../../../../client'

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

interface MsgBroadcasterLocalOptions {
  network: Network

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
  simulateTx?: boolean
}

/**
 * This class is used to broadcast transactions
 * using a privateKey as a signer
 * for the transactions and broadcasting
 * the transactions directly to the node
 *
 * Mainly used for working in a Node Environment
 */
export class MsgBroadcasterLocal {
  public endpoints: NetworkEndpoints

  public chainId: ChainId

  public ethereumChainId?: EthereumChainId

  public privateKey: PrivateKey

  public simulateTx: boolean = false

  public baseAccount: BaseAccount | undefined = undefined

  public txCount: number = 0

  constructor(options: MsgBroadcasterLocalOptions) {
    const networkInfo = getNetworkInfo(options.network)
    const endpoints = getNetworkEndpoints(options.network)

    this.simulateTx = options.simulateTx || false
    this.chainId = networkInfo.chainId
    this.ethereumChainId =
      options.ethereumChainId || networkInfo.ethereumChainId
    this.endpoints = { ...endpoints, ...(options.endpoints || {}) }
    this.privateKey =
      options.privateKey instanceof PrivateKey
        ? options.privateKey
        : PrivateKey.fromHex(options.privateKey)
  }

  /**
   * Broadcasting the transaction using the client
   *
   * @param tx
   * @returns {string} transaction hash
   */
  async broadcast(transaction: MsgBroadcasterTxOptions) {
    const { chainId, privateKey, endpoints, txCount } = this
    const msgs = Array.isArray(transaction.msgs)
      ? transaction.msgs
      : [transaction.msgs]

    const tx = {
      ...transaction,
      msgs,
    } as MsgBroadcasterTxOptions

    /** Account Details * */
    const publicKey = privateKey.toPublicKey()
    const accountDetails = await this.getAccountDetails()

    /** Block Details */
    const chainRestTendermintApi = new ChainRestTendermintApi(endpoints.rest)
    const latestBlock = await chainRestTendermintApi.fetchLatestBlock()
    const latestHeight = latestBlock.header.height
    const timeoutHeight = new BigNumberInBase(latestHeight).plus(
      DEFAULT_BLOCK_TIMEOUT_HEIGHT,
    )

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
      sequence: accountDetails.sequence + txCount,
      accountNumber: accountDetails.accountNumber,
      chainId: chainId,
    })

    /** Sign transaction */
    const signature = await privateKey.sign(Buffer.from(signBytes))

    /** Append Signatures */
    txRaw.signatures = [signature]

    /** Broadcast transaction */
    const txResponse = await new TxGrpcApi(endpoints.grpc).broadcast(txRaw)

    if (txResponse.code !== 0) {
      throw new GeneralException(
        new Error(
          `Transaction failed to be broadcasted - ${txResponse.rawLog}`,
        ),
      )
    }

    this.incrementTxCount()

    return txResponse
  }

  /**
   * Broadcasting the transaction with fee delegation services
   *
   * @param tx
   * @returns {string} transaction hash
   */
  async broadcastWithFeeDelegation(transaction: MsgBroadcasterTxOptions) {
    const { simulateTx, privateKey, ethereumChainId, endpoints } = this
    const msgs = Array.isArray(transaction.msgs)
      ? transaction.msgs
      : [transaction.msgs]

    const tx = {
      ...transaction,
      msgs,
    } as MsgBroadcasterTxOptions & { ethereumAddress: string }

    const web3Msgs = msgs.map((msg) => msg.toWeb3())

    if (!ethereumChainId) {
      throw new GeneralException(new Error('Please provide ethereumChainId'))
    }

    const transactionApi = new IndexerGrpcTransactionApi(endpoints.indexer)
    const txResponse = await transactionApi.prepareTxRequest({
      memo: tx.memo,
      message: web3Msgs,
      address: tx.ethereumAddress,
      chainId: ethereumChainId,
      gasLimit: getGasPriceBasedOnMessage(msgs),
      estimateGas: simulateTx || false,
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
  async simulate(transaction: MsgBroadcasterTxOptions) {
    const { privateKey, endpoints, chainId, txCount } = this
    const msgs = Array.isArray(transaction.msgs)
      ? transaction.msgs
      : [transaction.msgs]

    const tx = {
      ...transaction,
      msgs,
    } as MsgBroadcasterTxOptions

    /** Account Details * */
    const publicKey = privateKey.toPublicKey()
    const accountDetails = await this.getAccountDetails()

    /** Block Details */
    const chainRestTendermintApi = new ChainRestTendermintApi(endpoints.rest)
    const latestBlock = await chainRestTendermintApi.fetchLatestBlock()
    const latestHeight = latestBlock.header.height
    const timeoutHeight = new BigNumberInBase(latestHeight).plus(
      DEFAULT_BLOCK_TIMEOUT_HEIGHT,
    )

    /** Prepare the Transaction * */
    const { txRaw } = createTransaction({
      memo: tx.memo || '',
      fee: DEFAULT_STD_FEE,
      message: tx.msgs as Msgs[],
      timeoutHeight: timeoutHeight.toNumber(),
      pubKey: publicKey.toBase64(),
      sequence: accountDetails.sequence + txCount,
      accountNumber: accountDetails.accountNumber,
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
   * to be safe (factor of 1.1)
   */
  private async getTxWithStdFee(args: CreateTransactionArgs) {
    const { simulateTx } = this

    if (!simulateTx) {
      return createTransaction(args)
    }

    const result = await this.simulateTxRaw(args)

    if (!result.gasInfo?.gasUsed) {
      return createTransaction(args)
    }

    const stdGasFee = getStdFee({
      ...args.fee,
      gas: new BigNumberInBase(result.gasInfo.gasUsed).times(1.1).toFixed(),
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

  private async getAccountDetails() {
    if (this.baseAccount) {
      return this.baseAccount.toAccountDetails()
    }

    const chainRestAuthApi = new ChainRestAuthApi(this.endpoints.rest)
    const accountDetailsResponse = await chainRestAuthApi.fetchAccount(
      this.privateKey.toBech32(),
    )

    this.baseAccount = BaseAccount.fromRestApi(accountDetailsResponse)

    return this.baseAccount.toAccountDetails()
  }

  private async incrementTxCount() {
    this.txCount += 1
  }
}
