/* eslint-disable class-methods-use-this */
import {
  AccountAddress,
  ChainId,
  EthereumChainId,
  CosmosChainId,
} from '@injectivelabs/ts-types'
import { Web3Exception } from '@injectivelabs/exceptions'
import { DEFAULT_STD_FEE } from '@injectivelabs/utils'
import type Web3 from 'web3'
import { createTxRaw } from '@injectivelabs/tx-ts'
import { KeplrWallet } from '../../keplr'
import { ConcreteWalletStrategy } from '../types'
import BaseConcreteStrategy from './Base'
import { CosmosWallet } from '../../cosmos/CosmosWallet'

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
    const txRaw = createTxRaw(signResponse)

    try {
      const txHash = await keplrWallet.broadcastTx(txRaw)

      return await keplrWallet.waitTxBroadcasted(txHash)
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
    const cosmWallet = new CosmosWallet({
      ...endpoints,
      signer,
    })

    return cosmWallet.signTransaction({
      address,
      chainId,
      fee: {
        ...DEFAULT_STD_FEE,
        gas: transaction.gas || DEFAULT_STD_FEE.gas,
      },
      message: transaction.message,
      memo: transaction.memo,
      pubKey: Buffer.from(key.pubKey).toString('base64'),
    })
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
