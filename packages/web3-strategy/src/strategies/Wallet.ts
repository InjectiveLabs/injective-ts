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
import { TypedDataUtils } from 'eth-sig-util'
import * as ethUtil from 'ethereumjs-util'
import { ConcreteStrategyOptions, ConcreteWeb3Strategy } from '../types'
import BaseConcreteStrategy from '../BaseConcreteStrategy'

const remove0xFromPrivateKey = (privateKey: string): string =>
  privateKey.startsWith('0x') ? privateKey.substring(2) : privateKey

const padWithZeroes = (number: string, length: number): string => {
  let myString = `${number}`

  while (myString.length < length) {
    myString = `0${myString}`
  }

  return myString
}

const getPrivateKeyWalletProviderForSinglePrivateKey = (privateKey: string) =>
  new WalletSubprovider(
    new EthereumWallet(Buffer.from(remove0xFromPrivateKey(privateKey), 'hex')),
    {},
  )

const concatSig = (v: Buffer, r: Buffer, s: Buffer): Buffer => {
  const rSig = ethUtil.fromSigned(r)
  const sSig = ethUtil.fromSigned(s)
  const vSig = ethUtil.bufferToInt(v)
  const rStr = padWithZeroes(ethUtil.toUnsigned(rSig).toString('hex'), 64)
  const sStr = padWithZeroes(ethUtil.toUnsigned(sSig).toString('hex'), 64)
  const vStr = ethUtil.stripHexPrefix(ethUtil.intToHex(vSig))

  return Buffer.from(ethUtil.addHexPrefix(rStr.concat(sStr, vStr)).toString())
}

export default class Wallet
  extends BaseConcreteStrategy
  implements ConcreteWeb3Strategy {
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
    const message = TypedDataUtils.sign(JSON.parse(eip712json))
    const sig = ethUtil.ecsign(message, Buffer.from(privateKey, 'hex'))
    const bufferedSignature = concatSig(
      Buffer.from(sig.v.toString()),
      Buffer.from(sig.r.toString()),
      Buffer.from(sig.s.toString()),
    )

    return Promise.resolve(ethUtil.bufferToHex(bufferedSignature))
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
    callback((undefined as unknown) as AccountAddress)
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
