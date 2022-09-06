/* eslint-disable class-methods-use-this */
import {
  AccountAddress,
  ChainId,
  EthereumChainId,
  CosmosChainId,
} from '@injectivelabs/ts-types'
import { Web3Exception } from '@injectivelabs/exceptions'
import {
  BigNumberInBase,
  DEFAULT_STD_FEE,
  DEFAULT_TIMEOUT_HEIGHT,
  DEFAULT_TIMESTAMP_TIMEOUT_MS,
} from '@injectivelabs/utils'
import type Web3 from 'web3'
import {
  createTransaction,
  createTxRawFromSigResponse,
  TxRestClient,
} from '@injectivelabs/tx-ts'
import { SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx'
import { TxError } from '@injectivelabs/tx-ts/dist/types/tx-rest-client'
import { KeplrWallet } from '../../keplr'
import { ConcreteWalletStrategy } from '../types'
import BaseConcreteStrategy from './Base'
import { CosmosQuery } from '../../cosmos'

export default class Keplr
  extends BaseConcreteStrategy
  implements ConcreteWalletStrategy
{
  private keplrWallet: KeplrWallet

  constructor(args: {
    ethereumChainId: EthereumChainId
    chainId: ChainId
    web3: Web3
  }) {
    super(args)
    this.chainId = args.chainId || CosmosChainId.Injective
    this.keplrWallet = new KeplrWallet(args.chainId)
  }

  async getAddresses(): Promise<string[]> {
    const { keplrWallet, chainId } = this

    if (!keplrWallet) {
      throw new Web3Exception('Please install Keplr extension')
    }

    try {
      if (!KeplrWallet.checkChainIdSupport(chainId)) {
        await keplrWallet.experimentalSuggestChain()
      }

      const accounts = await keplrWallet.getAccounts()

      return accounts.map((account) => account.address)
    } catch (e: any) {
      throw new Web3Exception(`Keplr: ${e.message}`)
    }
  }

  async confirm(address: AccountAddress): Promise<string> {
    const { keplrWallet } = this

    if (!keplrWallet) {
      throw new Web3Exception('Please install Keplr extension')
    }

    return Promise.resolve(
      `0x${Buffer.from(
        `Confirmation for ${address} at time: ${Date.now()}`,
      ).toString('hex')}`,
    )
  }

  // eslint-disable-next-line class-methods-use-this
  async sendEthereumTransaction(
    _transaction: unknown,
    _options: { address: AccountAddress; ethereumChainId: EthereumChainId },
  ): Promise<string> {
    throw new Error(
      'sendEthereumTransaction is not supported. Keplr only supports sending cosmos transactions',
    )
  }

  async sendTransaction(
    signResponse: any,
    _options: { address: AccountAddress; chainId: ChainId },
  ): Promise<string> {
    const { keplrWallet } = this
    const txRaw = createTxRawFromSigResponse(signResponse)

    try {
      return await keplrWallet.broadcastTxBlock(txRaw)
    } catch (e) {
      throw new Error((e as any).message)
    }
  }

  async signTransaction(
    transaction: any,
    address: AccountAddress,
  ): Promise<any> {
    const { keplrWallet, chainId } = this

    if (!keplrWallet) {
      throw new Web3Exception('Please install Keplr extension')
    }

    const endpoints = await keplrWallet.getChainEndpoints()
    const key = await keplrWallet.getKey()
    const signer = await keplrWallet.getOfflineSigner()
    const query = new CosmosQuery(endpoints)
    const txClient = new TxRestClient(endpoints.rest)

    /** Account Details * */
    const accountDetails = await query.fetchAccountDetails(address)

    /** Block Details */
    const latestBlock = await query.fetchLatestBlock()
    const latestHeight = latestBlock.header.height
    const timeoutHeight = new BigNumberInBase(latestHeight).plus(
      DEFAULT_TIMEOUT_HEIGHT,
    )

    /** Prepare the Transaction * */
    const { bodyBytes, authInfoBytes, accountNumber } = createTransaction({
      message: transaction.message,
      memo: transaction.memo,
      fee: {
        ...DEFAULT_STD_FEE,
        gas: transaction.gas || DEFAULT_STD_FEE.gas,
      },
      pubKey: Buffer.from(key.pubKey).toString('base64'),
      sequence: Number(accountDetails.sequence),
      timeoutHeight: timeoutHeight.toNumber(),
      accountNumber: Number(accountDetails.accountNumber),
      chainId,
    })
    const cosmosSignDoc = SignDoc.fromPartial({
      bodyBytes,
      authInfoBytes,
      chainId,
      accountNumber,
    })

    /* Sign the transaction */
    const signResponse = await signer.signDirect(address, cosmosSignDoc)
    const txRaw = createTxRawFromSigResponse(signResponse)

    /* Broadcast the transaction */
    try {
      const response = await txClient.broadcast(
        txRaw,
        DEFAULT_TIMESTAMP_TIMEOUT_MS,
      )
      const errorResponse = response as TxError

      if (errorResponse.code && errorResponse.code !== 0) {
        throw new Error(response.raw_log)
      }
    } catch (e) {
      throw new Error(e as any)
    }
  }

  async getNetworkId(): Promise<string> {
    throw new Error('getNetworkId is not supported on Keplr')
  }

  async getChainId(): Promise<string> {
    throw new Error('getChainId is not supported on Keplr')
  }

  async getEthereumTransactionReceipt(_txHash: string): Promise<string> {
    throw new Error('getEthereumTransactionReceipt is not supported on Keplr')
  }
}
