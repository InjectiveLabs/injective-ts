import Web3 from 'web3'
import {
  AccountAddress,
  ChainId,
  EthereumChainId,
} from '@injectivelabs/ts-types'
import { createAlchemyWeb3 } from '@alch/alchemy-web3'
import Metamask from './strategies/Metamask'
import {
  ConcreteWalletStrategy,
  onAccountChangeCallback,
  onChainIdChangeCallback,
  Wallet,
  WalletStrategyArguments,
} from './types'
import Keplr from './strategies/Keplr'
import Trezor from './strategies/Trezor'
import LedgerLive from './strategies/Ledger/LedgerLive'
import LedgerLegacy from './strategies/Ledger/LedgerLegacy'
import Torus from './strategies/Torus'
import WalletConnect from './strategies/WalletConnect'

export default class WalletStrategy {
  private readonly strategies: Record<Wallet, ConcreteWalletStrategy>

  public wallet: Wallet

  constructor({
    wallet,
    chainId,
    ethereumChainId,
    options,
  }: WalletStrategyArguments) {
    const alchemyUrl =
      options.wsRpcUrls[ethereumChainId] || options.rpcUrls[ethereumChainId]
    const web3 = createAlchemyWeb3(alchemyUrl) as unknown as Web3

    this.strategies = {
      [Wallet.Metamask]: new Metamask({ chainId, ethereumChainId, web3 }),
      [Wallet.Ledger]: new LedgerLive({ chainId, ethereumChainId, web3 }),
      [Wallet.LedgerLegacy]: new LedgerLegacy({
        chainId,
        ethereumChainId,
        web3,
      }),
      [Wallet.Keplr]: new Keplr({
        ethereumChainId,
        web3,
        chainId,
      }),
      [Wallet.Trezor]: new Trezor({ chainId, ethereumChainId, web3 }),
      [Wallet.Torus]: new Torus({ chainId, ethereumChainId, web3 }),
      [Wallet.WalletConnect]: new WalletConnect({
        ethereumChainId,
        chainId,
        walletOptions: options,
      }),
    } as Record<Wallet, ConcreteWalletStrategy>

    this.wallet = wallet || Wallet.Metamask
  }

  public getWallet(): Wallet {
    return this.wallet
  }

  public setWallet(wallet: Wallet) {
    this.wallet = wallet
  }

  public getStrategy(): ConcreteWalletStrategy {
    return this.strategies[this.wallet]
  }

  public getAddresses(): Promise<AccountAddress[]> {
    return this.getStrategy().getAddresses()
  }

  public getChainId(): Promise<string> {
    return this.getStrategy().getChainId()
  }

  public getNetworkId(): Promise<string> {
    return this.getStrategy().getNetworkId()
  }

  public async getEthereumTransactionReceipt(txHash: string): Promise<void> {
    return this.getStrategy().getEthereumTransactionReceipt(txHash)
  }

  public async confirm(address: AccountAddress): Promise<string> {
    return this.getStrategy().confirm(address)
  }

  public async disconnectWallet() {
    const strategy = this.getStrategy()

    if (strategy.disconnect !== undefined) {
      await strategy.disconnect()
    }

    this.wallet = Wallet.Metamask
  }

  public async sendTransaction(
    tx: any,
    options: { address: AccountAddress; chainId: ChainId },
  ): Promise<string> {
    return this.getStrategy().sendTransaction(tx, options)
  }

  public async sendEthereumTransaction(
    tx: any,
    options: { address: AccountAddress; ethereumChainId: EthereumChainId },
  ): Promise<string> {
    return this.getStrategy().sendEthereumTransaction(tx, options)
  }

  public async signTransaction(
    data: any,
    address: AccountAddress,
  ): Promise<string | any> {
    return this.getStrategy().signTransaction(data, address)
  }

  public getWeb3(): Web3 {
    return this.getStrategy().getWeb3()
  }

  public onAccountChange(callback: onAccountChangeCallback): void {
    if (this.getStrategy().onAccountChange) {
      return this.getStrategy().onAccountChange!(callback)
    }
  }

  public onChainIdChange(callback: onChainIdChangeCallback): void {
    if (this.getStrategy().onChainIdChange) {
      return this.getStrategy().onChainIdChange!(callback)
    }
  }

  public cancelOnChainIdChange(): void {
    if (this.getStrategy().cancelOnChainIdChange) {
      return this.getStrategy().cancelOnChainIdChange!()
    }
  }

  public cancelAllEvents(): void {
    if (this.getStrategy().cancelAllEvents) {
      return this.getStrategy().cancelAllEvents!()
    }
  }

  public cancelOnAccountChange(): void {
    if (this.getStrategy().cancelOnAccountChange) {
      return this.getStrategy().cancelOnAccountChange!()
    }
  }
}
