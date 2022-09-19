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
import {
  createTxRawFromSigResponse,
  createTransactionAndCosmosSignDocForAddressAndMsg,
} from '@injectivelabs/sdk-ts'
import { LeapWallet } from '../../leap'
import { ConcreteWalletStrategy } from '../types'
import BaseConcreteStrategy from './Base'

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
      if (!(await leapWallet.checkChainIdSupport())) {
        throw new Error(`The ${chainId} is not supported on Leap.`)
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

    /** Prepare the Transaction * */
    const { cosmosSignDoc } =
      await createTransactionAndCosmosSignDocForAddressAndMsg({
        address,
        chainId,
        memo: transaction.memo,
        message: transaction.message,
        pubKey: Buffer.from(key.pubKey).toString('base64'),
        endpoint: endpoints.rest,
        fee: {
          ...DEFAULT_STD_FEE,
          gas: transaction.gas || DEFAULT_STD_FEE.gas,
        },
      })

    /* Sign the transaction */
    return signer.signDirect(address, cosmosSignDoc)
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
