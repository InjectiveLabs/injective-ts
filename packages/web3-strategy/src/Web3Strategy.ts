import Web3 from 'web3'
import { AccountAddress, ChainId } from '@injectivelabs/ts-types'
import { assert } from '@injectivelabs/assert'
import Metamask from './strategies/Metamask'
import WalletStrategy from './strategies/Wallet'
import Ledger from './strategies/Ledger/index'
import {
  Wallet,
  ConcreteWeb3Strategy,
  onAccountChangeCallback,
  onChainIdChangeCallback,
  Web3StrategyArguments,
} from './types'

export default class Web3Strategy {
  private strategy: ConcreteWeb3Strategy

  private chainId: ChainId

  private wallet: Wallet

  constructor({ wallet, chainId, options }: Web3StrategyArguments) {
    assert.inArray(chainId, Object.values(ChainId))
    assert.inArray(wallet, Object.values(Wallet))

    this.chainId = chainId
    this.wallet = wallet

    switch (this.wallet) {
      case Wallet.PrivateKey:
        this.strategy = new WalletStrategy({ chainId, options })
        break
      case Wallet.Metamask:
        this.strategy = new Metamask({ chainId, options })
        break
      case Wallet.Ledger:
        this.strategy = new Ledger({ chainId, options })
        break
      default:
        this.strategy = new Metamask({ chainId, options })
        break
    }
  }

  public getStrategy(): ConcreteWeb3Strategy {
    return this.strategy
  }

  public getAddresses(): Promise<AccountAddress[]> {
    return this.strategy.getAddresses()
  }

  public isWeb3Connected(): boolean {
    return this.strategy.isWeb3Connected()
  }

  public isMetamask(): boolean {
    return this.strategy.isMetamask()
  }

  public getChainId(): Promise<string> {
    return this.strategy.getChainId()
  }

  public getNetworkId(): Promise<string> {
    return this.strategy.getNetworkId()
  }

  public async getTransactionReceipt(txHash: string): Promise<void> {
    return this.strategy.getTransactionReceipt(txHash)
  }

  public async confirm(address: AccountAddress): Promise<string> {
    return this.strategy.confirm(address)
  }

  public async sendTransaction(
    tx: unknown,
    options: { address: AccountAddress; chainId: ChainId },
  ): Promise<string> {
    return this.strategy.sendTransaction(tx, options)
  }

  public async signTypedDataV4(
    data: string,
    address: AccountAddress,
  ): Promise<string> {
    return this.strategy.signTypedDataV4(data, address)
  }

  public getWeb3(): Web3 {
    return this.strategy.getWeb3ForChainId(this.chainId)
  }

  public getWeb3ForChainId(chainId: ChainId): Web3 {
    return this.strategy.getWeb3ForChainId(chainId)
  }

  public getWeb3Ws(): Web3 {
    return this.strategy.getWeb3WsForChainId(this.chainId)
  }

  public getWeb3WsForChainId(chainId: ChainId): Web3 {
    return this.strategy.getWeb3WsForChainId(chainId)
  }

  public onAccountChange(callback: onAccountChangeCallback): void {
    if (this.strategy.onAccountChange) {
      return this.strategy.onAccountChange(callback)
    }
  }

  public onChainIdChange(callback: onChainIdChangeCallback): void {
    if (this.strategy.onChainIdChange) {
      return this.strategy.onChainIdChange(callback)
    }
  }

  public cancelOnChainIdChange(): void {
    if (this.strategy.cancelOnChainIdChange) {
      return this.strategy.cancelOnChainIdChange()
    }
  }

  public cancelAllEvents(): void {
    if (this.strategy.cancelAllEvents) {
      return this.strategy.cancelAllEvents()
    }
  }

  public cancelOnAccountChange(): void {
    if (this.strategy.cancelOnAccountChange) {
      return this.strategy.cancelOnAccountChange()
    }
  }
}
