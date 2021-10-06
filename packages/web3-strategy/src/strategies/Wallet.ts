import { sleep } from '@injectivelabs/utils'
import { AccountAddress, ChainId } from '@injectivelabs/ts-types'
import { Web3Exception } from '@injectivelabs/exceptions'
import ProviderEngine from 'web3-provider-engine'
import NonceTrackerSubprovider from 'web3-provider-engine/subproviders/nonce-tracker'
import SanitizingSubprovider from 'web3-provider-engine/subproviders/sanitizer'
import WalletSubprovider from 'web3-provider-engine/subproviders/wallet'
import RpcSubprovider from 'web3-provider-engine/subproviders/rpc'
import { provider, TransactionConfig } from 'web3-core'
import EthereumWallet from 'ethereumjs-wallet'
import { signTypedData_v4 as signTypedDataV4 } from 'eth-sig-util'
import * as ethUtil from 'ethereumjs-util'
import { ConcreteStrategyOptions, ConcreteWeb3Strategy } from '../types'
import BaseConcreteStrategy from '../BaseConcreteStrategy'

const remove0xFromPrivateKey = (privateKey: string): string =>
  privateKey.startsWith('0x') ? privateKey.substring(2) : privateKey

const getPrivateKeyWalletProviderForSinglePrivateKey = (privateKey: string) =>
  new WalletSubprovider(
    new EthereumWallet(Buffer.from(remove0xFromPrivateKey(privateKey), 'hex')),
    {},
  )

export default class Wallet
  extends BaseConcreteStrategy
  implements ConcreteWeb3Strategy
{
  private privateKey: string

  constructor({
    chainId,
    options,
  }: {
    chainId: ChainId
    options: ConcreteStrategyOptions
  }) {
    super({ chainId, options })

    if (!options.privateKey) {
      throw new Web3Exception('Private key must be provided')
    }

    this.privateKey = options.privateKey
  }

  async getAddresses(): Promise<string[]> {
    return this.getWeb3ForChainId(this.chainId).eth.getAccounts()
  }

  async confirm(address: AccountAddress): Promise<string> {
    const signed = this.getWeb3ForChainId(this.chainId).eth.accounts.sign(
      `Confirmation for ${address} at time: ${Date.now()}`,
      this.privateKey,
    )

    return Promise.resolve(signed.signature)
  }

  async sendTransaction(
    transaction: unknown,
    _options: { address: AccountAddress; chainId: ChainId },
  ): Promise<string> {
    const { transactionHash } = await this.getWeb3ForChainId(
      this.chainId,
    ).eth.sendTransaction(transaction as TransactionConfig)

    return transactionHash
  }

  signTypedDataV4(
    eip712json: string,
    _address: AccountAddress,
  ): Promise<string> {
    const { privateKey } = this
    const sig = signTypedDataV4(Buffer.from(privateKey, 'hex'), {
      data: JSON.parse(eip712json),
    })

    return Promise.resolve(`0x${ethUtil.toBuffer(sig).toString('hex')}`)
  }

  async getNetworkId(): Promise<string> {
    return (
      await this.getWeb3ForChainId(this.chainId).eth.net.getId()
    ).toString()
  }

  async getChainId(): Promise<string> {
    return (
      await this.getWeb3ForChainId(this.chainId).eth.getChainId()
    ).toString()
  }

  async getTransactionReceipt(txHash: string): Promise<string> {
    const interval = 1000
    const transactionReceiptRetry = async (): Promise<string> => {
      const web3 = this.getWeb3ForChainId(this.chainId)
      const receipt = await web3.eth.getTransactionReceipt(txHash)

      if (!receipt) {
        await sleep(interval)
        await transactionReceiptRetry()
      }

      return receipt.transactionHash
    }

    return transactionReceiptRetry()
  }

  onChainChanged = (callback: () => void): void => {
    callback()
  }

  onAccountChanged = (callback: (account: AccountAddress) => void): void => {
    callback(undefined as unknown as AccountAddress)
  }

  setOptions(options: ConcreteStrategyOptions): void {
    this.privateKey = options.privateKey || this.privateKey
  }

  getWeb3ProviderEngineForRpc = ({
    rpcUrl,
    pollingInterval,
  }: {
    rpcUrl: string
    pollingInterval: number
  }): provider => {
    const engine = new ProviderEngine({
      pollingInterval,
    })

    engine.addProvider(new NonceTrackerSubprovider())
    engine.addProvider(new SanitizingSubprovider())
    engine.addProvider(
      getPrivateKeyWalletProviderForSinglePrivateKey(this.privateKey),
    )
    engine.addProvider(new RpcSubprovider({ rpcUrl }))
    engine.start()

    return engine as provider
  }

  isWeb3Connected = (): boolean => true

  isMetamask = (): boolean => false
}
