import {
  BaseAccount,
  ChainRestAuthApi,
  ChainRestTendermintApi,
  createTransaction,
  Msgs,
  PrivateKey,
  TxRestClient,
} from '@injectivelabs/sdk-ts'
import {
  BigNumberInBase,
  DEFAULT_STD_FEE,
  DEFAULT_TIMEOUT_HEIGHT,
} from '@injectivelabs/utils'
import { GeneralException } from 'packages/exceptions/dist'
import {
  MsgBroadcasterOptionsLocal,
  MsgBroadcasterTxOptions,
  MsgBroadcasterTxOptionsWithAddresses,
} from './types'
import { getEthereumSignerAddress, getInjectiveSignerAddress } from './utils'

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
      ethereumAddress: getEthereumSignerAddress(
        transaction.injectiveAddress || transaction.address,
      ),
      injectiveAddress: getInjectiveSignerAddress(
        transaction.injectiveAddress || transaction.address,
      ),
    } as MsgBroadcasterTxOptionsWithAddresses

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
      ethereumAddress: getEthereumSignerAddress(
        transaction.injectiveAddress || transaction.address,
      ),
      injectiveAddress: getInjectiveSignerAddress(
        transaction.injectiveAddress || transaction.address,
      ),
    } as MsgBroadcasterTxOptionsWithAddresses

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
