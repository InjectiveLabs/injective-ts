import { BaseAccount, PrivateKey } from '../accounts'
import { Msgs } from '../modules'
import { createTransaction } from './tx'
import { TxRestClient } from './client/TxRestClient'
import {
  ChainRestAuthApi,
  ChainRestTendermintApi,
} from './../../client/chain/rest'
import {
  BigNumberInBase,
  DEFAULT_STD_FEE,
  DEFAULT_BLOCK_TIMEOUT_HEIGHT,
} from '@injectivelabs/utils'
import { GeneralException } from '@injectivelabs/exceptions'
import {
  getEthereumSignerAddress,
  getInjectiveSignerAddress,
} from './utils/helpers'
import { ChainId, EthereumChainId } from '@injectivelabs/ts-types'
import {
  getNetworkEndpoints,
  getNetworkInfo,
  Network,
  NetworkEndpoints,
} from '@injectivelabs/networks'

interface MsgBroadcasterTxOptions {
  msgs: Msgs | Msgs[]
  injectiveAddress: string
  ethereumAddress?: string
  memo?: string
  feePrice?: string
  feeDenom?: string
  gasLimit?: number
}

interface MsgBroadcasterOptionsLocal {
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
  privateKey: string
  ethereumChainId?: EthereumChainId
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

  public privateKey: PrivateKey

  constructor(options: MsgBroadcasterOptionsLocal) {
    const networkInfo = getNetworkInfo(options.network)
    const endpoints = getNetworkEndpoints(options.network)

    this.chainId = networkInfo.chainId
    this.endpoints = { ...endpoints, ...(endpoints || {}) }
    this.privateKey = PrivateKey.fromHex(options.privateKey)
  }

  /**
   * Broadcasting the transaction using the client
   *
   * @param tx
   * @returns {string} transaction hash
   */
  async broadcast(transaction: MsgBroadcasterTxOptions) {
    const { chainId, privateKey, endpoints } = this
    const tx = {
      ...transaction,
      msgs: Array.isArray(transaction.msgs)
        ? transaction.msgs
        : [transaction.msgs],
      ethereumAddress: getEthereumSignerAddress(transaction.injectiveAddress),
      injectiveAddress: getInjectiveSignerAddress(transaction.injectiveAddress),
    } as MsgBroadcasterTxOptions

    /** Account Details * */
    const publicKey = privateKey.toPublicKey()
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

    /** Prepare the Transaction * */
    const { signBytes, txRaw } = createTransaction({
      memo: '',
      fee: DEFAULT_STD_FEE,
      message: (tx.msgs as Msgs[]).map((m) => m.toDirectSign()),
      timeoutHeight: timeoutHeight.toNumber(),
      pubKey: publicKey.toBase64(),
      sequence: accountDetails.sequence,
      accountNumber: accountDetails.accountNumber,
      chainId: chainId,
    })

    /** Sign transaction */
    const signature = await privateKey.sign(Buffer.from(signBytes))

    /** Append Signatures */
    txRaw.setSignaturesList([signature])

    /** Broadcast transaction */
    const txResponse = await new TxRestClient(endpoints.rest).broadcast(txRaw)

    if (txResponse.code !== 0) {
      throw new GeneralException(
        new Error(
          `Transaction failed to be broadcasted - ${txResponse.rawLog}`,
        ),
      )
    }

    return txResponse.txHash
  }

  /**
   * Broadcasting the transaction using the client
   *
   * @param tx
   * @returns {string} transaction hash
   */
  async simulate(transaction: MsgBroadcasterTxOptions) {
    const { privateKey, endpoints, chainId } = this
    const tx = {
      ...transaction,
      msgs: Array.isArray(transaction.msgs)
        ? transaction.msgs
        : [transaction.msgs],
      ethereumAddress: getEthereumSignerAddress(transaction.injectiveAddress),
      injectiveAddress: getInjectiveSignerAddress(transaction.injectiveAddress),
    } as MsgBroadcasterTxOptions

    /** Account Details * */
    const publicKey = privateKey.toPublicKey()
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

    /** Prepare the Transaction * */
    const { signBytes, txRaw } = createTransaction({
      memo: '',
      fee: DEFAULT_STD_FEE,
      message: (tx.msgs as Msgs[]).map((m) => m.toDirectSign()),
      timeoutHeight: timeoutHeight.toNumber(),
      pubKey: publicKey.toBase64(),
      sequence: accountDetails.sequence,
      accountNumber: accountDetails.accountNumber,
      chainId: chainId,
    })

    /** Sign transaction */
    const signature = await privateKey.sign(Buffer.from(signBytes))

    /** Append Signatures */
    txRaw.setSignaturesList([signature])

    /** Simulate transaction */
    const simulationResponse = await new TxRestClient(endpoints.rest).simulate(
      txRaw,
    )

    return simulationResponse
  }
}
