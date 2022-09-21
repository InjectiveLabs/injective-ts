import Web3 from 'web3'
import {
  AccountAddress,
  ChainId,
  EthereumChainId,
} from '@injectivelabs/ts-types'
import { createAlchemyWeb3 } from '@alch/alchemy-web3'
import { DirectSignResponse } from '@cosmjs/proto-signing'
import { Msgs } from '@injectivelabs/sdk-ts'
import { GeneralException } from '@injectivelabs/exceptions'
import Metamask from './strategies/Metamask'
import {
  ConcreteWalletStrategy,
  onAccountChangeCallback,
  onChainIdChangeCallback,
  Wallet,
  WalletStrategyArguments,
} from './types'
import Keplr from './strategies/Keplr'
import Leap from './strategies/Leap'
import Cosmostation from './strategies/Cosmostation'
import Trezor from './strategies/Trezor'
import LedgerLive from './strategies/Ledger/LedgerLive'
import LedgerLegacy from './strategies/Ledger/LedgerLegacy'
import Torus from './strategies/Torus'
import WalletConnect from './strategies/WalletConnect'

const createWallet = ({
  wallet,
  args,
  web3,
}: {
  wallet: Wallet
  args: WalletStrategyArguments
  web3: Web3
}): ConcreteWalletStrategy | undefined => {
  const disabledWallets = args.options.disabledWallets || []

  if (disabledWallets.includes(wallet)) {
    return undefined
  }

  switch (wallet) {
    case Wallet.Metamask:
      return new Metamask({ ...args, web3 })
    case Wallet.Ledger:
      return new LedgerLive({ ...args, web3 })
    case Wallet.LedgerLegacy:
      return new LedgerLegacy({ ...args, web3 })
    case Wallet.Keplr:
      return new Keplr({ ...args })
    case Wallet.Trezor:
      return new Trezor({ ...args, web3 })
    case Wallet.Torus:
      return new Torus({ ...args, web3 })
    case Wallet.Leap:
      return new Leap({ ...args })
    case Wallet.Cosmostation:
      return new Cosmostation({ ...args })
    case Wallet.WalletConnect:
      return new WalletConnect({ ...args, walletOptions: args.options })
    default:
      throw new GeneralException(
        new Error(`The ${wallet} concrete wallet strategy is not supported`),
      )
  }
}

const createWallets = (
  args: WalletStrategyArguments,
  web3: Web3,
): Record<Wallet, ConcreteWalletStrategy | undefined> =>
  Object.values(Wallet).reduce(
    (strategies, wallet) => ({
      ...strategies,
      [wallet]: createWallet({ wallet, args, web3 }),
    }),
    {} as Record<Wallet, ConcreteWalletStrategy | undefined>,
  )

const createWeb3 = (args: WalletStrategyArguments): Web3 => {
  const alchemyUrl =
    args.options.wsRpcUrls[args.ethereumChainId] ||
    args.options.rpcUrls[args.ethereumChainId]

  return createAlchemyWeb3(alchemyUrl) as unknown as Web3
}

export default class WalletStrategy {
  public strategies: Record<Wallet, ConcreteWalletStrategy | undefined>

  public wallet: Wallet

  constructor(args: WalletStrategyArguments) {
    const web3 = createWeb3(args)
    this.strategies = createWallets(args, web3)
    this.wallet = args.wallet || Wallet.Metamask
  }

  public getWallet(): Wallet {
    return this.wallet
  }

  public setWallet(wallet: Wallet) {
    this.wallet = wallet
  }

  public getStrategy(): ConcreteWalletStrategy {
    if (!this.strategies[this.wallet]) {
      throw new GeneralException(
        new Error(`Wallet ${this.wallet} is not enabled/available!`),
      )
    }

    return this.strategies[this.wallet] as ConcreteWalletStrategy
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
    tx: DirectSignResponse,
    options: { address: AccountAddress; chainId: ChainId },
  ): Promise<string> {
    return this.getStrategy().sendTransaction(tx, options)
  }

  public async sendEthereumTransaction(
    tx: any /* TODO */,
    options: {
      address: AccountAddress /* Ethereum address */
      ethereumChainId: EthereumChainId
    },
  ): Promise<string> {
    return this.getStrategy().sendEthereumTransaction(tx, options)
  }

  public async signTransaction(
    data:
      | string /* When using EIP712 typed data */
      | { memo: string; gas: string; message: Msgs | Msgs[] },
    address: AccountAddress,
  ): Promise<string | DirectSignResponse> {
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
