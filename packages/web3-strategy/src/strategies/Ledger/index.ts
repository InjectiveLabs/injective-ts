/* eslint-disable class-methods-use-this */
import { AccountAddress, ChainId } from '@injectivelabs/ts-types'
import EthLedger from '@ledgerhq/hw-app-eth'
import { Web3Exception } from '@injectivelabs/exceptions'
import { TypedDataUtils } from 'eth-sig-util'
import { bufferToHex } from 'ethereumjs-util'
import { ConcreteStrategyOptions, ConcreteWeb3Strategy } from '../../types'
import BaseConcreteStrategy from '../../BaseConcreteStrategy'
import { DEFAULT_BASE_DERIVATION_PATH } from '../../constants'
import LedgerTransport, { isLedgerSupportedInWindow } from './transport'

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

  async getAddresses(): Promise<string[]> {
    const ledger = await this.ledger.getInstance()
    const result = await ledger.getAddress(this.baseDerivationPath)

    return [result.address]
  }

  async confirm(address: AccountAddress): Promise<string> {
    const ledger = await this.ledger.getInstance()
    const signed = await ledger.signPersonalMessage(
      this.baseDerivationPath,
      `Confirmation for ${address} at time: ${Date.now()}`,
    )
    const combined = `${signed.r}${signed.s}${signed.v.toString(16)}`

    return combined.startsWith('0x') ? combined : `0x${combined}`
  }

  async sendTransaction(
    _transaction: unknown,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _address: AccountAddress,
  ): Promise<string> {
    throw new Web3Exception(
      'Please use Metamask for signing non EIP-712 transactions',
    )
  }

  async signTypedDataV4(
    eip712json: string,
    _address: AccountAddress,
  ): Promise<string> {
    const object = JSON.parse(eip712json)
    const ledger = await this.ledger.getInstance()
    const result = await ledger.signEIP712HashedMessage(
      this.baseDerivationPath,
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

  onChainChanged = (_callback: () => void): void => {
    //
  }

  onAccountChanged = (_callback: (account: AccountAddress) => void): void => {
    //
  }

  isWeb3Connected = (): boolean => isLedgerSupportedInWindow

  isMetamask = (): boolean => false
}
