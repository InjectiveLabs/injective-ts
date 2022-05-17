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
    const web3Creator = (): Web3 =>
      createAlchemyWeb3(options.wsRpcUrl || options.rpcUrl) as unknown as Web3

    this.strategies = {
      [Wallet.Metamask]: new Metamask({ chainId, web3Creator }),
      [Wallet.Ledger]: new LedgerLive({ chainId, web3Creator }),
      [Wallet.LedgerLegacy]: new LedgerLegacy({ chainId, web3Creator }),
      [Wallet.Keplr]: new Keplr({ chainId, web3Creator }),
      [Wallet.Trezor]: new Trezor({ chainId, web3Creator }),
      [Wallet.Torus]: new Torus({ chainId, web3Creator }),
      [Wallet.WalletConnect]: new WalletConnect({
        chainId,
        rpcUrl: options.wsRpcUrl || options.rpcUrl,
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

  public async disconnectWallet() {
    await this.getStrategy().disconnect?.()
    this.wallet = Wallet.Metamask
  }

  public getStrategy(): ConcreteWeb3Strategy {
    return this.strategies[this.wallet]
  }

  public getAddresses(): Promise<AccountAddress[]> {
    return this.strategies[this.wallet].getAddresses()
  }

  public isWeb3Connected(): boolean {
    return this.strategies[this.wallet].isWeb3Connected()
  }

  public isMetamask(): boolean {
    return this.strategies[this.wallet].isMetamask()
  }

  public getChainId(): Promise<string> {
    return this.strategies[this.wallet].getChainId()
  }

  public getNetworkId(): Promise<string> {
    return this.strategies[this.wallet].getNetworkId()
  }

  public async getTransactionReceipt(txHash: string): Promise<void> {
    return this.strategies[this.wallet].getTransactionReceipt(txHash)
  }

  public async confirm(address: AccountAddress): Promise<string> {
    return this.strategies[this.wallet].confirm(address)
  }

  public async sendTransaction(
    tx: any,
    options: { address: AccountAddress; chainId: ChainId },
  ): Promise<string> {
    return this.strategies[this.wallet].sendTransaction(tx, options)
  }

  public async signTypedDataV4(
    data: any,
    address: AccountAddress,
  ): Promise<string | any> {
    return this.strategies[this.wallet].signTypedDataV4(data, address)
  }

  public getWeb3(): Web3 {
    return this.getStrategy().getWeb3()
  }

  public onAccountChange(callback: onAccountChangeCallback): void {
    if (this.strategies[this.wallet].onAccountChange) {
      return this.strategies[this.wallet].onAccountChange!(callback)
    }
  }

  public onChainIdChange(callback: onChainIdChangeCallback): void {
    if (this.strategies[this.wallet].onChainIdChange) {
      return this.strategies[this.wallet].onChainIdChange!(callback)
    }
  }

  public cancelOnChainIdChange(): void {
    if (this.strategies[this.wallet].cancelOnChainIdChange) {
      return this.strategies[this.wallet].cancelOnChainIdChange!()
    }
  }

  public cancelAllEvents(): void {
    if (this.strategies[this.wallet].cancelAllEvents) {
      return this.strategies[this.wallet].cancelAllEvents!()
    }
  }

  public cancelOnAccountChange(): void {
    if (this.strategies[this.wallet].cancelOnAccountChange) {
      return this.strategies[this.wallet].cancelOnAccountChange!()
    }
  }
}
