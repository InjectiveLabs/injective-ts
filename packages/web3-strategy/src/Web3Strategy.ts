import Web3 from 'web3'
import { AccountAddress, ChainId } from '@injectivelabs/ts-types'
import { createAlchemyWeb3 } from '@alch/alchemy-web3'
import Metamask from './strategies/Metamask'
import {
  ConcreteWeb3Strategy,
  onAccountChangeCallback,
  onChainIdChangeCallback,
  Wallet,
  Web3StrategyArguments,
} from './types'
import Keplr from './strategies/Keplr'
import Trezor from './strategies/Trezor'
import LedgerLive from './strategies/Ledger/LedgerLive'
import LedgerLegacy from './strategies/Ledger/LedgerLegacy'
import Torus from './strategies/Torus'
import WalletConnect from './strategies/WalletConnect'

export default class Web3Strategy {
  private readonly strategies: Record<Wallet, ConcreteWeb3Strategy>

  public wallet: Wallet

  constructor({ wallet, chainId, options }: Web3StrategyArguments) {
    const web3 = createAlchemyWeb3(
      options.wsRpcUrl || options.rpcUrl,
    ) as unknown as Web3

    this.strategies = {
      [Wallet.Metamask]: new Metamask({ chainId, web3 }),
      [Wallet.Ledger]: new LedgerLive({ chainId, web3 }),
      [Wallet.LedgerLegacy]: new LedgerLegacy({ chainId, web3 }),
      [Wallet.Keplr]: new Keplr({ chainId, web3 }),
      [Wallet.Trezor]: new Trezor({ chainId, web3 }),
      [Wallet.Torus]: new Torus({ chainId, web3 }),
      [Wallet.WalletConnect]: new WalletConnect({
        chainId,
        web3,
        rpcEndpoints: options,
      }),
    } as Record<Wallet, ConcreteWeb3Strategy>

    this.wallet = wallet || Wallet.Metamask
  }

  public getWallet(): Wallet {
    return this.wallet
  }

  public setWallet(wallet: Wallet) {
    this.wallet = wallet
  }

  public getStrategy(): ConcreteWeb3Strategy {
    return this.strategies[this.wallet]
  }

  public getAddresses(): Promise<AccountAddress[]> {
    return this.getStrategy().getAddresses()
  }

  public isWeb3Connected(): boolean {
    return this.getStrategy().isWeb3Connected()
  }

  public isMetamask(): boolean {
    return this.getStrategy().isMetamask()
  }

  public getChainId(): Promise<string> {
    return this.getStrategy().getChainId()
  }

  public getNetworkId(): Promise<string> {
    return this.getStrategy().getNetworkId()
  }

  public async getTransactionReceipt(txHash: string): Promise<void> {
    return this.getStrategy().getTransactionReceipt(txHash)
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

  public async signTypedDataV4(
    data: any,
    address: AccountAddress,
  ): Promise<string | any> {
    return this.getStrategy().signTypedDataV4(data, address)
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
