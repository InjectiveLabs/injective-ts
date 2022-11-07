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
  DEFAULT_TIMEOUT_HEIGHT,
} from '@injectivelabs/utils'
import { GeneralException } from '@injectivelabs/exceptions'
import {
  getEthereumSignerAddress,
  getInjectiveSignerAddress,
} from './utils/helpers'
import { ChainId, EthereumChainId } from '@injectivelabs/ts-types'

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
  endpoints: {
    indexerApi: string
    sentryGrpcApi: string
    sentryHttpApi: string
  }
  chainId: ChainId
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
  public options: MsgBroadcasterOptionsLocal

  public privateKey: PrivateKey

  constructor(options: MsgBroadcasterOptionsLocal) {
    this.options = options
    this.privateKey = PrivateKey.fromHex(options.privateKey)
  }

  /**
   * Broadcasting the transaction using the client
   *
   * @param tx
   * @returns {string} transaction hash
   */
  async broadcast(transaction: MsgBroadcasterTxOptions) {
    const { options, privateKey } = this
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

    /** Prepare the Transaction * */
    const { signBytes, txRaw } = createTransaction({
      memo: '',
      fee: DEFAULT_STD_FEE,
      message: (tx.msgs as Msgs[]).map((m) => m.toDirectSign()),
      timeoutHeight: timeoutHeight.toNumber(),
      pubKey: publicKey.toBase64(),
      sequence: accountDetails.sequence,
      accountNumber: accountDetails.accountNumber,
      chainId: options.chainId,
    })

    /** Sign transaction */
    const signature = await privateKey.sign(Buffer.from(signBytes))

    /** Append Signatures */
    txRaw.setSignaturesList([signature])

    /** Broadcast transaction */
    const txResponse = await new TxRestClient(
      options.endpoints.sentryHttpApi,
    ).broadcast(txRaw)

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
    const { options, privateKey } = this
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

    /** Prepare the Transaction * */
    const { signBytes, txRaw } = createTransaction({
      memo: '',
      fee: DEFAULT_STD_FEE,
      message: (tx.msgs as Msgs[]).map((m) => m.toDirectSign()),
      timeoutHeight: timeoutHeight.toNumber(),
      pubKey: publicKey.toBase64(),
      sequence: accountDetails.sequence,
      accountNumber: accountDetails.accountNumber,
      chainId: options.chainId,
    })

    /** Sign transaction */
    const signature = await privateKey.sign(Buffer.from(signBytes))

    /** Append Signatures */
    txRaw.setSignaturesList([signature])

    /** Simulate transaction */
    const simulationResponse = await new TxRestClient(
      options.endpoints.sentryHttpApi,
    ).simulate(txRaw)

    return simulationResponse
  }
}
