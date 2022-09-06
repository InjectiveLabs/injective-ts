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
import { LeapWallet } from '../../leap'
import { ConcreteWalletStrategy } from '../types'
import BaseConcreteStrategy from './Base'
import { CosmosQuery } from '../../cosmos'

export default class Leap
  extends BaseConcreteStrategy
  implements ConcreteWalletStrategy
{
  private leapWallet: LeapWallet

  constructor(args: {
    ethereumChainId: EthereumChainId
    chainId: ChainId
    web3: Web3
  }) {
    super(args)
    this.chainId = args.chainId || CosmosChainId.Injective
    this.leapWallet = new LeapWallet(args.chainId)
  }

  async getAddresses(): Promise<string[]> {
    const { leapWallet, chainId } = this

    if (!leapWallet) {
      throw new Web3Exception('Please install Leap extension')
    }

    try {
      if (!LeapWallet.checkChainIdSupport(chainId)) {
        throw new Error(`Leap doesn't support ${chainId} yet!`)
      }

      const accounts = await leapWallet.getAccounts()

      return accounts.map((account) => account.address)
    } catch (e: any) {
      throw new Web3Exception(`Leap: ${e.message}`)
    }
  }

  async confirm(address: AccountAddress): Promise<string> {
    const { leapWallet } = this

    if (!leapWallet) {
      throw new Web3Exception('Please install Leap extension')
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
      'sendEthereumTransaction is not supported. Leap only supports sending cosmos transactions',
    )
  }

  async sendTransaction(
    signResponse: any,
    _options: { address: AccountAddress; chainId: ChainId },
  ): Promise<string> {
    const { leapWallet } = this
    const txRaw = createTxRawFromSigResponse(signResponse)

    try {
      return await leapWallet.broadcastTxBlock(txRaw)
    } catch (e) {
      throw new Error((e as any).message)
    }
  }

  async signTransaction(
    transaction: any,
    address: AccountAddress,
  ): Promise<any> {
    const { leapWallet, chainId } = this

    if (!leapWallet) {
      throw new Web3Exception('Please install Keplr extension')
    }

    const endpoints = await leapWallet.getChainEndpoints()
    const key = await leapWallet.getKey()
    const signer = await leapWallet.getOfflineSigner()
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
    throw new Error('getNetworkId is not supported on Leap')
  }

  async getChainId(): Promise<string> {
    throw new Error('getChainId is not supported on Leap')
  }

  async getEthereumTransactionReceipt(_txHash: string): Promise<string> {
    throw new Error('getEthereumTransactionReceipt is not supported on Leap')
  }
}
