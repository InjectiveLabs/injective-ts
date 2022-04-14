import Web3 from 'web3'
import { AccountAddress, ChainId } from '@injectivelabs/ts-types'
import { createAlchemyWeb3 } from '@alch/alchemy-web3'
import Metamask from './strategies/Metamask'
import {
  Wallet,
  ConcreteWeb3Strategy,
  onAccountChangeCallback,
  onChainIdChangeCallback,
  Web3StrategyArguments,
} from './types'
import Keplr from './strategies/Keplr'
import Trezor from './strategies/Trezor'
import LedgerLive from './strategies/Ledger/LedgerLive'
import LedgerLegacy from './strategies/Ledger/LedgerLegacy'
import Torus from './strategies/Torus'

export default class Web3Strategy {
  private strategies: Record<Wallet, ConcreteWeb3Strategy>

  public web3: Web3

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
    } as Record<Wallet, ConcreteWeb3Strategy> // TODO

    this.web3 = web3
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
    return this.web3
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
