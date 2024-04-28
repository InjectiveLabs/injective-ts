import { AccountAddress, EthereumChainId } from '@injectivelabs/ts-types'
import { DirectSignResponse } from '@cosmjs/proto-signing'
import { GeneralException, WalletException } from '@injectivelabs/exceptions'
import { TxRaw, TxResponse } from '@injectivelabs/sdk-ts'
import Metamask from './strategies/Metamask'
import TrustWallet from './strategies/TrustWallet'
import {
  ConcreteWalletStrategy,
  onAccountChangeCallback,
  onChainIdChangeCallback,
  WalletStrategyArguments,
  EthereumWalletStrategyArgs,
  WalletStrategyEthereumOptions,
  WalletStrategyOptions,
} from '../types'
import Keplr from './strategies/Keplr'
import Leap from './strategies/Leap'
import Ninji from './strategies/Ninji'
import Trezor from './strategies/Trezor'
import PrivateKey from './strategies/PrivateKey'
import LedgerLive from './strategies/Ledger/LedgerLive'
import LedgerLegacy from './strategies/Ledger/LedgerLegacy'
import Torus from './strategies/Torus'
import Phantom from './strategies/Phantom'
import Okx from './strategies/Okx'
import BitGet from './strategies/BitGet'
import Cosmostation from './strategies/Cosmostation'
import LedgerCosmos from './strategies/LedgerCosmos'
import WalletConnect from './strategies/WalletConnect'
import { Wallet, WalletDeviceType } from '../../types/enums'
import { isEthWallet, isCosmosWallet } from './utils'
import { SendTransactionOptions } from './types'

const getInitialWallet = (args: WalletStrategyArguments): Wallet => {
  if (args.wallet) {
    return args.wallet
  }

  return args.ethereumOptions ? Wallet.Metamask : Wallet.Keplr
}

const ethereumWalletsDisabled = (args: WalletStrategyArguments) => {
  const { ethereumOptions } = args

  if (!ethereumOptions) {
    return true
  }

  const { ethereumChainId } = ethereumOptions

  if (!ethereumChainId) {
    return true
  }

  return false
}

const createStrategy = ({
  args,
  wallet,
}: {
  args: WalletStrategyArguments
  wallet: Wallet
}): ConcreteWalletStrategy | undefined => {
  const disabledWallets = args.disabledWallets || []

  if (disabledWallets.includes(wallet)) {
    return undefined
  }

  /**
   * If we only want to use Cosmos Native Wallets
   * We are not creating strategies for Ethereum Native Wallets
   */
  if (isEthWallet(wallet) && ethereumWalletsDisabled(args)) {
    return undefined
  }

  const ethWalletArgs = {
    chainId: args.chainId,
    ethereumOptions: args.ethereumOptions as WalletStrategyEthereumOptions,
  } as EthereumWalletStrategyArgs

  switch (wallet) {
    case Wallet.Metamask:
      return new Metamask(ethWalletArgs)
    case Wallet.TrustWallet:
      return new TrustWallet(ethWalletArgs)
    case Wallet.Ledger:
      return new LedgerLive(ethWalletArgs)
    case Wallet.LedgerLegacy:
      return new LedgerLegacy(ethWalletArgs)
    case Wallet.Trezor:
      return new Trezor(ethWalletArgs)
    case Wallet.Torus:
      return new Torus(ethWalletArgs)
    case Wallet.Phantom:
      return new Phantom(ethWalletArgs)
    case Wallet.OkxWallet:
      return new Okx(ethWalletArgs)
    case Wallet.BitGet:
      return new BitGet(ethWalletArgs)
    case Wallet.WalletConnect:
      return new WalletConnect({
        ...ethWalletArgs,
        metadata: args.options?.metadata,
      })
    case Wallet.PrivateKey:
      return new PrivateKey({
        ...ethWalletArgs,
        privateKey: args.options?.privateKey,
      })
    case Wallet.Keplr:
      return new Keplr({ ...args })
    case Wallet.Cosmostation:
      return new Cosmostation({ ...args })
    case Wallet.LedgerCosmos:
      return new LedgerCosmos({ ...args })
    case Wallet.Leap:
      return new Leap({ ...args })
    case Wallet.Ninji:
      return new Ninji({ ...args })
    default:
      return undefined
  }
}

const createStrategies = (
  args: WalletStrategyArguments,
): Record<Wallet, ConcreteWalletStrategy | undefined> => {
  return Object.values(Wallet).reduce(
    (strategies, wallet) => ({
      ...strategies,
      [wallet]: createStrategy({ wallet, args }),
    }),
    {} as Record<Wallet, ConcreteWalletStrategy | undefined>,
  )
}

export default class WalletStrategy {
  public strategies: Record<Wallet, ConcreteWalletStrategy | undefined>

  public wallet: Wallet

  public args: WalletStrategyArguments

  constructor(args: WalletStrategyArguments) {
    this.args = args
    this.strategies = createStrategies(args)
    this.wallet = getInitialWallet(args)
  }

  public getWallet(): Wallet {
    return this.wallet
  }

  public setWallet(wallet: Wallet) {
    this.disconnect()
    this.wallet = wallet
  }

  /**
   * Case 1: Private Key is set dynamically
   * If we have a dynamically set private key,
   * we are creating a new PrivateKey strategy
   * with the specified private key
   *
   * Case 2: Wallet Connect Metadata set dynamically
   */
  public setOptions(options?: WalletStrategyOptions) {
    if (options?.privateKey) {
      this.strategies[Wallet.PrivateKey] = createStrategy({
        args: this.args,
        wallet: Wallet.PrivateKey,
      })
    }

    if (options?.metadata) {
      this.strategies[Wallet.WalletConnect] = createStrategy({
        args: this.args,
        wallet: Wallet.WalletConnect,
      })
    }
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

  public getWalletDeviceType(): Promise<WalletDeviceType> {
    return this.getStrategy().getWalletDeviceType()
  }

  public getPubKey(address?: string): Promise<string> {
    return this.getStrategy().getPubKey(address)
  }

  public enable(args?: unknown): Promise<boolean> {
    return this.getStrategy().enable(args)
  }

  public async enableAndGetAddresses(
    args?: unknown,
  ): Promise<AccountAddress[]> {
    await this.getStrategy().enable(args)

    return this.getStrategy().getAddresses()
  }

  public getEthereumChainId(): Promise<string> {
    return this.getStrategy().getEthereumChainId()
  }

  public async getEthereumTransactionReceipt(txHash: string): Promise<void> {
    return this.getStrategy().getEthereumTransactionReceipt(txHash)
  }

  public async getSessionOrConfirm(address?: AccountAddress): Promise<string> {
    return this.getStrategy().getSessionOrConfirm(address)
  }

  public async sendTransaction(
    tx: DirectSignResponse | TxRaw,
    options: SendTransactionOptions,
  ): Promise<TxResponse> {
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

    /** Phantom wallet needs enabling before signing */
    if (this.wallet === Wallet.Phantom) {
      await this.enable()
    }

    return this.getStrategy().signEip712TypedData(eip712TypedData, address)
  }

  public async signAminoCosmosTransaction(transaction: {
    signDoc: any
    accountNumber: number
    chainId: string
    address: string
  }): Promise<string> {
    if (isEthWallet(this.wallet)) {
      throw new WalletException(
        new Error(`You can't sign Cosmos Transaction using ${this.wallet}`),
      )
    }

    return this.getStrategy().signAminoCosmosTransaction(transaction)
  }

  public async signCosmosTransaction(transaction: {
    txRaw: TxRaw
    accountNumber: number
    chainId: string
    address: string
  }): Promise<DirectSignResponse> {
    if (isEthWallet(this.wallet)) {
      throw new WalletException(
        new Error(`You can't sign Cosmos Transaction using ${this.wallet}`),
      )
    }

    return this.getStrategy().signCosmosTransaction(transaction)
  }

  public async signArbitrary(
    signer: string,
    data: string | Uint8Array,
  ): Promise<string | void> {
    if (this.getStrategy().signArbitrary) {
      return this.getStrategy().signArbitrary!(signer, data)
    }
  }

  public async onAccountChange(
    callback: onAccountChangeCallback,
  ): Promise<void> {
    if (this.getStrategy().onAccountChange) {
      return this.getStrategy().onAccountChange!(callback)
    }
  }

  public async onChainIdChange(
    callback: onChainIdChangeCallback,
  ): Promise<void> {
    if (this.getStrategy().onChainIdChange) {
      return this.getStrategy().onChainIdChange!(callback)
    }
  }

  public async disconnect() {
    if (this.getStrategy().disconnect) {
      await this.getStrategy().disconnect!()
    }
  }
}
