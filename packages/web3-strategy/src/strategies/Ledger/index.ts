/* eslint-disable class-methods-use-this */
import { AccountAddress, ChainId } from '@injectivelabs/ts-types'
import EthLedger from '@ledgerhq/hw-app-eth'
import { TypedDataUtils } from 'eth-sig-util'
import { bufferToHex } from 'ethereumjs-util'
import { Transaction } from 'ethereumjs-tx'
import HDNode from 'hdkey'
import {
  ConcreteStrategyOptions,
  ConcreteWeb3Strategy,
  DerivedHDKeyInfo,
} from '../../types'
import BaseConcreteStrategy from '../../BaseConcreteStrategy'
import {
  DEFAULT_ADDRESS_SEARCH_LIMIT,
  DEFAULT_BASE_DERIVATION_PATH,
  DEFAULT_NUM_ADDRESSES_TO_FETCH,
} from '../../constants'
import LedgerTransport, { isLedgerSupportedInWindow } from './transport'
import { WalletUtils } from '../../utils'

export const stringHash = (message: string) =>
  Buffer.from(message).toString('hex')

export const domainHash = (message: any) =>
  TypedDataUtils.hashStruct('EIP712Domain', message.domain, message.types, true)

export const messageHash = (message: any) =>
  TypedDataUtils.hashStruct(
    message.primaryType,
    message.message,
    message.types,
    true,
  )

export default class Ledger
  extends BaseConcreteStrategy
  implements ConcreteWeb3Strategy {
  private baseDerivationPath: string

  private ledger: LedgerTransport

  constructor({
    chainId,
    options,
  }: {
    chainId: ChainId
    options: ConcreteStrategyOptions
  }) {
    super({ chainId, options })

    this.baseDerivationPath =
      options.baseDerivationPath || DEFAULT_BASE_DERIVATION_PATH
    this.ledger = new LedgerTransport(EthLedger)
  }

  public getPath(): string {
    return this.baseDerivationPath
  }

  public setPath(basDerivationPath: string): void {
    this.baseDerivationPath = basDerivationPath
  }

  public async getAddresses(
    numberOfAccounts: number = DEFAULT_NUM_ADDRESSES_TO_FETCH,
  ): Promise<string[]> {
    const initialDerivedKeyInfo = await this.initialDerivedKeyInfo()
    const derivedKeyInfos = WalletUtils.calculateDerivedHDKeyInfos(
      initialDerivedKeyInfo,
      numberOfAccounts,
    )
    const accounts = derivedKeyInfos.map((k) => k.address)

    return accounts
  }

  async confirm(address: AccountAddress): Promise<string> {
    const derivationPath = await this.getDerivationPathForAddress(address)
    const ledger = await this.ledger.getInstance()
    const signed = await ledger.signPersonalMessage(
      derivationPath,
      `Confirmation for ${address} at time: ${Date.now()}`,
    )
    const combined = `${signed.r}${signed.s}${signed.v.toString(16)}`

    return combined.startsWith('0x') ? combined : `0x${combined}`
  }

  async sendTransaction(
    _transaction: unknown,
    _options: { address: string; chainId: ChainId },
  ): Promise<string> {
    throw new Error(
      "Please use metamask's ledger implementation to sign non EIP-1559 messages.",
    )
  }

  async sendTransaction1(
    transaction: unknown,
    options: { address: string; chainId: ChainId },
  ): Promise<string> {
    /** Sign the Transaction */
    const chainId = parseInt(options.chainId.toString(), 10)
    const web3 = this.getWeb3ForChainId(chainId)
    const nonce = await web3.eth.getTransactionCount(options.address)
    const txObject = transaction as object
    const gas = `0x${(transaction as any).gas}`
    const gasPrice = `0x${(transaction as any).gasPrice}`
    const txData = {
      ...txObject,
      gas,
      gasPrice,
      nonce: `0x${(nonce + 2).toString(16)}`,
    }
    const tx = new Transaction(txData, { chain: chainId })

    // Set the EIP155 bits
    const vIndex = 6
    tx.raw[vIndex] = Buffer.from([chainId]) // v
    const rIndex = 7
    tx.raw[rIndex] = Buffer.from([]) // r
    const sIndex = 8
    tx.raw[sIndex] = Buffer.from([]) // s

    const serializedTx = tx.serialize().toString('hex')
    const ledger = await this.ledger.getInstance()
    const derivationPath = await this.getDerivationPathForAddress(
      options.address,
    )
    const signed = await ledger.signTransaction(derivationPath, serializedTx)

    /** Send the Transaction */
    tx.r = Buffer.from(signed.r, 'hex')
    tx.s = Buffer.from(signed.s, 'hex')
    tx.v = Buffer.from(signed.v, 'hex')

    const signedSerializedTx = tx.serialize().toString('hex')
    const txReceipt = await web3.eth.sendSignedTransaction(
      `0x${signedSerializedTx}`,
    )

    return txReceipt.transactionHash
  }

  async signTypedDataV4(
    eip712json: string,
    address: AccountAddress,
  ): Promise<string> {
    const derivationPath = await this.getDerivationPathForAddress(address)
    const object = JSON.parse(eip712json)
    const ledger = await this.ledger.getInstance()
    const result = await ledger.signEIP712HashedMessage(
      derivationPath,
      bufferToHex(domainHash(object)),
      bufferToHex(messageHash(object)),
    )

    const combined = `${result.r}${result.s}${result.v.toString(16)}`

    return combined.startsWith('0x') ? combined : `0x${combined}`
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
    return Promise.resolve(txHash)
  }

  private async initialDerivedKeyInfo(): Promise<DerivedHDKeyInfo> {
    const ledger = await this.ledger.getInstance()
    const parentKeyDerivationPath = `m/${this.baseDerivationPath}`
    const result = await ledger.getAddress(parentKeyDerivationPath)

    const hdKey = new HDNode()
    hdKey.publicKey = Buffer.from(result.publicKey, 'hex')
    hdKey.chainCode = Buffer.from(result.chainCode || '', 'hex')
    const address = WalletUtils.addressOfHDKey(hdKey)
    const initialDerivedKeyInfo = {
      hdKey,
      address,
      derivationPath: parentKeyDerivationPath,
      baseDerivationPath: this.baseDerivationPath,
    }

    return initialDerivedKeyInfo
  }

  private findDerivedKeyInfoForAddress(
    initialHdKey: DerivedHDKeyInfo,
    address: string,
  ): DerivedHDKeyInfo {
    const matchedDerivedKeyInfo = WalletUtils.findDerivedKeyInfoForAddressIfExists(
      address,
      initialHdKey,
      DEFAULT_ADDRESS_SEARCH_LIMIT,
    )

    if (matchedDerivedKeyInfo === undefined) {
      throw new Error(`Address ${address} not found`)
    }

    return matchedDerivedKeyInfo
  }

  private async getDerivationPathForAddress(
    address: AccountAddress,
  ): Promise<string> {
    const initialDerivedKeyInfo = await this.initialDerivedKeyInfo()
    const derivedKeyInfo = this.findDerivedKeyInfoForAddress(
      initialDerivedKeyInfo,
      address,
    )

    return derivedKeyInfo.derivationPath
  }

  onChainChanged = (_callback: () => void): void => {
    //
  }

  onAccountChanged = (_callback: (account: AccountAddress) => void): void => {
    //
  }

  isWeb3Connected = (): boolean => isLedgerSupportedInWindow

  isMetamask = (): boolean => false
}
