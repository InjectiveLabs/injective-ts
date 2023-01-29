import { BaseAccount, PrivateKey } from '../../../accounts'
import { Msgs } from '../../..'
import { createTransaction } from '..'
import { TxGrpcApi } from '../api/TxGrpcApi'
import {
  ChainRestAuthApi,
  ChainRestTendermintApi,
} from '../../../../client/chain/rest'
import {
  BigNumberInBase,
  getStdFee,
  DEFAULT_BLOCK_TIMEOUT_HEIGHT,
  DEFAULT_STD_FEE,
} from '@injectivelabs/utils'
import { GeneralException } from '@injectivelabs/exceptions'
import {
  getEthereumSignerAddress,
  getInjectiveSignerAddress,
} from '../utils/helpers'
import { ChainId, EthereumChainId } from '@injectivelabs/ts-types'
import {
  getNetworkEndpoints,
  getNetworkInfo,
  Network,
  NetworkEndpoints,
} from '@injectivelabs/networks'
import { getGasPriceBasedOnMessage } from '../../../../utils/msgs'

interface MsgBroadcasterTxOptions {
  msgs: Msgs | Msgs[]
  injectiveAddress: string
  ethereumAddress?: string
  memo?: string
  feePrice?: string
  feeDenom?: string
  gasLimit?: number
}

interface MsgBroadcasterOptionsWithPk {
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

  public privateKey: PrivateKey

  constructor(options: MsgBroadcasterOptionsWithPk) {
    const networkInfo = getNetworkInfo(options.network)
    const endpoints = getNetworkEndpoints(options.network)

    this.chainId = networkInfo.chainId
    this.endpoints = { ...endpoints, ...(endpoints || {}) }
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
    const { chainId, privateKey, endpoints } = this
    const msgs = Array.isArray(transaction.msgs)
      ? transaction.msgs
      : [transaction.msgs]

    const tx = {
      ...transaction,
      msgs: msgs,
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

    const gas = (
      transaction.gasLimit || getGasPriceBasedOnMessage(msgs)
    ).toString()

    /** Prepare the Transaction * */
    const { signBytes, txRaw } = createTransaction({
      memo: '',
      fee: getStdFee(gas),
      message: msgs,
      timeoutHeight: timeoutHeight.toNumber(),
      pubKey: publicKey.toBase64(),
      sequence: accountDetails.sequence,
      accountNumber: accountDetails.accountNumber,
      chainId: chainId,
    })

    /** Sign transaction */
    const signature = await privateKey.sign(Buffer.from(signBytes))

    /** Append Signatures */
    txRaw.signatures = [signature]

    /** Broadcast transaction */
    const txApi = new TxGrpcApi(endpoints.grpc)
    const txResponse = await txApi.broadcast(txRaw)

    if (txResponse.code !== 0) {
      throw new GeneralException(
        new Error(
          `Transaction failed to be broadcasted - ${txResponse.rawLog}`,
        ),
      )
    }

    return txResponse
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
    const { txRaw } = createTransaction({
      memo: '',
      fee: DEFAULT_STD_FEE,
      message: tx.msgs as Msgs[],
      timeoutHeight: timeoutHeight.toNumber(),
      pubKey: publicKey.toBase64(),
      sequence: accountDetails.sequence,
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
}
