/* eslint-disable class-methods-use-this */
import { AccountAddress, ChainId } from '@injectivelabs/ts-types'
import { Web3Exception } from '@injectivelabs/exceptions'
import { KeplrWallet, CosmJsWallet } from '@injectivelabs/cosmos-ts'
import {
  BigNumberInBase,
  DEFAULT_GAS_LIMIT,
  DEFAULT_GAS_PRICE,
} from '@injectivelabs/utils'
import Web3 from 'web3'
import { ConcreteWeb3Strategy } from '../types'
import BaseConcreteStrategy from './Base'

export default class Keplr
  extends BaseConcreteStrategy
  implements ConcreteWeb3Strategy
{
  private keplrWallet: KeplrWallet

  private cosmJsWallet: CosmJsWallet

  private injectiveChainId = 'injective-1'

  constructor({ chainId, web3 }: { chainId: ChainId; web3: Web3 }) {
    super({ chainId, web3 })

    this.keplrWallet = new KeplrWallet(this.injectiveChainId)
    this.cosmJsWallet = new CosmJsWallet(this.injectiveChainId)
  }

  async getAddresses(): Promise<string[]> {
    if (!this.keplrWallet) {
      throw new Web3Exception('Please install Keplr extension')
    }

    if (this.chainId !== ChainId.Mainnet) {
      throw new Error('Keplr is only supported on Mainnet')
    }

    try {
      if (!KeplrWallet.checkChainIdSupport(this.injectiveChainId)) {
        await this.keplrWallet.experimentalSuggestChain()
      }

      const accounts = await this.keplrWallet.getAccounts()

      return accounts.map((account) => account.address)
    } catch (e: any) {
      throw new Web3Exception(`Metamask: ${e.message}`)
    }
  }

  async confirm(address: AccountAddress): Promise<string> {
    if (!this.keplrWallet) {
      throw new Web3Exception('Please install Keplr extension')
    }

    return Promise.resolve(
      `0x${Buffer.from(
        `Confirmation for ${address} at time: ${Date.now()}`,
      ).toString('hex')}`,
    )
  }

  async sendTransaction(
    signResponse: any,
    _options: { address: AccountAddress; chainId: ChainId },
  ): Promise<string> {
    return this.cosmJsWallet.broadcastRawTransaction(signResponse)
  }

  async signTypedDataV4(
    transaction: any,
    address: AccountAddress,
  ): Promise<any> {
    if (!this.keplrWallet) {
      throw new Web3Exception('Please install Keplr extension')
    }

    const fee = {
      amount: [
        {
          amount: new BigNumberInBase(DEFAULT_GAS_LIMIT)
            .times(DEFAULT_GAS_PRICE)
            .toString(),
          denom: 'inj',
        },
      ],
      gas: DEFAULT_GAS_LIMIT.toString(),
    }

    return this.cosmJsWallet.signRawTransaction({
      message: transaction.message,
      memo: transaction.memo,
      address,
      fee,
    })
  }

  async getNetworkId(): Promise<string> {
    return (await this.web3.eth.net.getId()).toString()
  }

  async getChainId(): Promise<string> {
    return (await this.web3.eth.getChainId()).toString()
  }

  async getTransactionReceipt(txHash: string): Promise<string> {
    return Promise.resolve(txHash)
  }

  isWeb3Connected = (): boolean => true

  isMetamask = (): boolean => false
}
