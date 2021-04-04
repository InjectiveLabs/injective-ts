/* eslint-disable class-methods-use-this */
import { AccountAddress, ChainId } from '@injectivelabs/ts-types'
import EthLedger from '@ledgerhq/hw-app-eth'
import { TypedDataUtils } from 'eth-sig-util'
import { bufferToHex, addHexPrefix } from 'ethereumjs-util'
import { Transaction } from 'ethereumjs-tx'
import Web3 from 'web3'
import { Web3Exception } from '@injectivelabs/exceptions'
import {
  ConcreteStrategyOptions,
  ConcreteWeb3Strategy,
  LedgerDerivationPathType,
} from '../../types'
import BaseConcreteStrategy from '../../BaseConcreteStrategy'
import { DEFAULT_BASE_DERIVATION_PATH } from '../../constants'
import LedgerTransport, { isLedgerSupportedInWindow } from './transport'
import AccountManager from './AccountManager'

const domainHash = (message: any) =>
  TypedDataUtils.hashStruct('EIP712Domain', message.domain, message.types, true)

const messageHash = (message: any) =>
  TypedDataUtils.hashStruct(
    message.primaryType,
    message.message,
    message.types,
    true,
  )

const getSignableTx = async ({
  web3,
  txData,
  address,
  chainId,
}: {
  web3: Web3
  txData: any
  address: AccountAddress
  chainId: ChainId
}) => {
  const nonce = await web3.eth.getTransactionCount(address)
  const gasInHex = addHexPrefix(txData.gas)
  const gasPriceInHex = addHexPrefix(txData.gasPrice)
  const tx = {
    ...txData,
    from: address,
    gas: gasInHex,
    gasLimit: gasInHex,
    gasPrice: gasPriceInHex,
    nonce: addHexPrefix(nonce.toString(16)),
  }

  return new Transaction(tx, { chain: chainId })
}

export default class Ledger
  extends BaseConcreteStrategy
  implements ConcreteWeb3Strategy {
  private baseDerivationPath: string

  private derivationPathType: LedgerDerivationPathType

  private ledger: LedgerTransport

  private accountManager: AccountManager

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
    this.derivationPathType = LedgerDerivationPathType.LedgerLive
    this.ledger = new LedgerTransport(EthLedger)
    this.accountManager = new AccountManager(this.ledger)
  }

  setOptions(options: ConcreteStrategyOptions): void {
    this.baseDerivationPath =
      options.baseDerivationPath || this.baseDerivationPath

    /**
     * If derivation path type changed
     * we need to remove any "wallets"
     * we already have in the account manager
     */
    const derivationPathTypeChanged =
      options.derivationPathType &&
      this.derivationPathType !== options.derivationPathType

    if (derivationPathTypeChanged) {
      this.accountManager.reset()
      this.derivationPathType =
        options.derivationPathType || this.derivationPathType
    }
  }

  public async getAddresses(): Promise<string[]> {
    const { accountManager, baseDerivationPath, derivationPathType } = this

    try {
      const wallets = await accountManager.getWallets(
        baseDerivationPath,
        derivationPathType,
      )

      return wallets.map((k) => k.address)
    } catch (e) {
      throw new Error(e.message)
    }
  }

  async confirm(address: AccountAddress): Promise<string> {
    const { derivationPath } = await this.accountManager.getWalletForAddress(
      address,
    )

    try {
      const ledger = await this.ledger.getInstance()
      const signed = await ledger.signPersonalMessage(
        derivationPath,
        `Confirmation for ${address} at time: ${Date.now()}`,
      )
      const combined = `${signed.r}${signed.s}${signed.v.toString(16)}`
      return combined.startsWith('0x') ? combined : `0x${combined}`
    } catch (e) {
      throw new Error(e.message)
    }
  }

  async sendTransaction(
    txData: any,
    options: { address: string; chainId: ChainId },
  ): Promise<string> {
    const chainId = parseInt(options.chainId.toString(), 10)
    const web3 = this.getWeb3ForChainId(chainId)

    const tx = await getSignableTx({
      web3,
      txData,
      address: options.address,
      chainId,
    })
    const vIndex = 6
    tx.raw[vIndex] = Buffer.from([chainId]) // v
    const rIndex = 7
    tx.raw[rIndex] = Buffer.from([]) // r
    const sIndex = 8
    tx.raw[sIndex] = Buffer.from([]) // s
    const serializedTx = tx.serialize().toString('hex')

    const ledger = await this.ledger.getInstance()
    const { derivationPath } = await this.accountManager.getWalletForAddress(
      options.address,
    )

    let signedSerializedTx
    try {
      const signed = await ledger.signTransaction(derivationPath, serializedTx)
      tx.r = Buffer.from(signed.r, 'hex')
      tx.s = Buffer.from(signed.s, 'hex')
      tx.v = Buffer.from(signed.v, 'hex')

      signedSerializedTx = tx.serialize().toString('hex')
    } catch (e) {
      throw new Error(e)
    }

    try {
      const txReceipt = await web3.eth.sendSignedTransaction(
        addHexPrefix(signedSerializedTx),
      )
      return txReceipt.transactionHash
    } catch (e) {
      throw new Web3Exception(e)
    }
  }

  async signTypedDataV4(
    eip712json: string,
    address: AccountAddress,
  ): Promise<string> {
    const { derivationPath } = await this.accountManager.getWalletForAddress(
      address,
    )
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

  onChainChanged = (_callback: () => void): void => {
    //
  }

  onAccountChanged = (_callback: (account: AccountAddress) => void): void => {
    //
  }

  isWeb3Connected = (): boolean => isLedgerSupportedInWindow

  isMetamask = (): boolean => false
}
