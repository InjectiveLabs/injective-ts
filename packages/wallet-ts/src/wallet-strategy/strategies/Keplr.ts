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
} from '@injectivelabs/utils'
import type Web3 from 'web3'
import {
  createCosmosSignDocFromTransaction,
  createTxRawFromSigResponse,
} from '@injectivelabs/sdk-ts/dist/core/transaction'
import { ChainRestAuthApi, ChainRestTendermintApi } from '@injectivelabs/sdk-ts'
import { KeplrWallet } from '../../keplr'
import { ConcreteWalletStrategy } from '../types'
import BaseConcreteStrategy from './Base'

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
    const { keplrWallet } = this

    if (!keplrWallet) {
      throw new Web3Exception('Please install Keplr extension')
    }

    try {
      if (!(await keplrWallet.checkChainIdSupport())) {
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

    // Clients
    const chainRestApi = new ChainRestAuthApi(endpoints.rest)
    const tendermintRestApi = new ChainRestTendermintApi(endpoints.rest)

    /** Account Details * */
    const accountDetails = await chainRestApi.fetchAccount(address)

    /** Block Details */
    const latestBlock = await tendermintRestApi.fetchLatestBlock()
    const latestHeight = latestBlock.header.height
    const timeoutHeight = new BigNumberInBase(latestHeight).plus(
      DEFAULT_TIMEOUT_HEIGHT,
    )

    /** Prepare the Transaction * */
    const { cosmosSignDoc } = createCosmosSignDocFromTransaction({
      chainId,
      memo: transaction.memo,
      message: transaction.message,
      pubKey: Buffer.from(key.pubKey).toString('base64'),
      sequence: Number(accountDetails.account.base_account.sequence),
      timeoutHeight: timeoutHeight.toNumber(),
      accountNumber: Number(accountDetails.account.base_account.account_number),
      fee: {
        ...DEFAULT_STD_FEE,
        gas: transaction.gas || DEFAULT_STD_FEE.gas,
      },
    })

    /* Sign the transaction */
    return signer.signDirect(address, cosmosSignDoc)
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
