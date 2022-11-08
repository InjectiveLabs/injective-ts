import Web3 from 'web3'
import {
  AccountAddress,
  ChainId,
  EthereumChainId,
} from '@injectivelabs/ts-types'
import { createAlchemyWeb3 } from '@alch/alchemy-web3'
import { DirectSignResponse } from '@cosmjs/proto-signing'
import { GeneralException, WalletException } from '@injectivelabs/exceptions'
import { TxRaw } from '@injectivelabs/chain-api/cosmos/tx/v1beta1/tx_pb'
import Metamask from './strategies/Metamask'
import {
  ConcreteWalletStrategy,
  EthereumWalletStrategyArgs,
  onAccountChangeCallback,
  onChainIdChangeCallback,
  WalletStrategyArguments,
  WalletStrategyEthereumOptions,
} from './types'
import Keplr from './strategies/Keplr'
import Leap from './strategies/Leap'
import Cosmostation from './strategies/Cosmostation'
import Trezor from './strategies/Trezor'
import LedgerLive from './strategies/Ledger/LedgerLive'
import LedgerLegacy from './strategies/Ledger/LedgerLegacy'
import Torus from './strategies/Torus'
import WalletConnect from './strategies/WalletConnect'
import CosmostationEth from './strategies/CosmostationEth'
import { Wallet } from '../types/enums'
import { isEthWallet } from './utils'
import { isCosmosWallet } from '../cosmos'

const ethereumWalletsDisabled = (args: WalletStrategyArguments) => {
  const { ethereumOptions } = args

  if (!ethereumOptions) {
    return true
  }

  const { wsRpcUrl, rpcUrl, ethereumChainId } = ethereumOptions

  if (!ethereumChainId) {
    return true
  }

  if (!wsRpcUrl && !rpcUrl) {
    return true
  }

  return false
}

const createStrategy = ({
  wallet,
  args,
  web3,
}: {
  wallet: Wallet
  args: WalletStrategyArguments
  web3?: Web3
}): ConcreteWalletStrategy | undefined => {
  const disabledWallets = args.disabledWallets || []

  if (disabledWallets.includes(wallet)) {
    return undefined
  }

  /**
   * If we only want to use Cosmos Native Wallets
   * We are not creating strategies for Ethereum Native Wallets
   */
  if (isEthWallet(wallet) && !web3) {
    return undefined
  }

  const ethWalletArgs = {
    web3: web3 as Web3,
    chainId: args.chainId,
    ethereumOptions: args.ethereumOptions as WalletStrategyEthereumOptions,
  } as EthereumWalletStrategyArgs

  switch (wallet) {
    case Wallet.Metamask:
      return new Metamask(ethWalletArgs)
    case Wallet.Ledger:
      return new LedgerLive(ethWalletArgs)
    case Wallet.LedgerLegacy:
      return new LedgerLegacy(ethWalletArgs)
    case Wallet.Trezor:
      return new Trezor(ethWalletArgs)
    case Wallet.Torus:
      return new Torus(ethWalletArgs)
    case Wallet.CosmostationEth:
      return new CosmostationEth(ethWalletArgs)
    case Wallet.WalletConnect:
      return new WalletConnect(ethWalletArgs)
    case Wallet.Keplr:
      return new Keplr({ ...args })
    case Wallet.Leap:
      return new Leap({ ...args })
    case Wallet.Cosmostation:
      return new Cosmostation({ ...args })
    default:
      throw new GeneralException(
        new Error(`The ${wallet} concrete wallet strategy is not supported`),
      )
  }
}

const createWeb3 = (args: WalletStrategyArguments): Web3 => {
  const { ethereumOptions } = args

  if (!ethereumOptions) {
    throw new WalletException(new Error('Please provide Ethereum chainId'))
  }

  const { wsRpcUrl, rpcUrl, ethereumChainId } = ethereumOptions

  if (!ethereumChainId) {
    throw new WalletException(new Error('Please provide Ethereum chainId'))
  }

  if (!wsRpcUrl && !rpcUrl) {
    throw new WalletException(
      new Error('Please provide Ethereum RPC endpoints'),
    )
  }

  const alchemyUrl = (wsRpcUrl as string) || (rpcUrl as string)

  return createAlchemyWeb3(alchemyUrl) as unknown as Web3
}

const createStrategies = (
  args: WalletStrategyArguments,
): Record<Wallet, ConcreteWalletStrategy | undefined> => {
  const web3 = ethereumWalletsDisabled(args) ? undefined : createWeb3(args)

  return Object.values(Wallet).reduce(
    (strategies, wallet) => ({
      ...strategies,
      [wallet]: createStrategy({ wallet, args, web3 }),
    }),
    {} as Record<Wallet, ConcreteWalletStrategy | undefined>,
  )
}

export default class WalletStrategy {
  public strategies: Record<Wallet, ConcreteWalletStrategy | undefined>

  public wallet: Wallet

  constructor(args: WalletStrategyArguments) {
    this.strategies = createStrategies(args)
    this.wallet =
      args.wallet || args.ethereumOptions ? Wallet.Metamask : Wallet.Keplr
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

  public getPubKey(): Promise<string> {
    return this.getStrategy().getPubKey()
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
    tx: DirectSignResponse | TxRaw,
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

  /** @deprecated * */
  public async signTransaction(
    data:
      | string /* When using EIP712 typed data */
      | { txRaw: TxRaw; accountNumber: number; chainId: string },
    address: AccountAddress,
  ): Promise<string | DirectSignResponse> {
    return this.getStrategy().signTransaction(data, address)
  }

  public async signEip712TypedData(
    eip712TypedData: string,
    address: AccountAddress,
  ): Promise<string> {
    if (isCosmosWallet(this.wallet)) {
      throw new WalletException(
        new Error(`You can't sign Ethereum Transaction using ${this.wallet}`),
      )
    }

    return this.getStrategy().signEip712TypedData(eip712TypedData, address)
  }

  public async signCosmosTransaction(
    transaction: { txRaw: TxRaw; accountNumber: number; chainId: string },
    address: AccountAddress,
  ): Promise<DirectSignResponse> {
    if (isEthWallet(this.wallet)) {
      throw new WalletException(
        new Error(`You can't sign Cosmos Transaction using ${this.wallet}`),
      )
    }

    return this.getStrategy().signCosmosTransaction(transaction, address)
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
