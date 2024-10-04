import {
  AccountAddress,
  ChainId,
  EthereumChainId,
} from '@injectivelabs/ts-types'
import { DirectSignResponse } from '@cosmjs/proto-signing'
import { GeneralException, WalletException } from '@injectivelabs/exceptions'
import { TxRaw, TxResponse } from '@injectivelabs/sdk-ts'
import {
  ConcreteWalletStrategy,
  onAccountChangeCallback,
  onChainIdChangeCallback,
  EthereumWalletStrategyArgs,
  WalletStrategyEthereumOptions,
  WalletStrategyOptions,
  CosmosWalletStrategyArguments,
  Wallet,
  WalletDeviceType,
} from '@injectivelabs/wallet-ts'
import LedgerLive from './strategies/Ledger/LedgerLive'
import LedgerLegacy from './strategies/Ledger/LedgerLegacy'
import LedgerCosmos from './strategies/LedgerCosmos'
import { SendTransactionOptions } from '@injectivelabs/wallet-ts'
import { WalletLedger } from './types'

export interface WalletStrategyArguments
  extends Omit<
    CosmosWalletStrategyArguments,
    'chainId' | 'disabledWallets' | 'wallet'
  > {
  chainId: ChainId
  options?: WalletStrategyOptions
  ethereumOptions?: WalletStrategyEthereumOptions
  wallet?: WalletLedger
}

export const isEthWallet = (wallet: WalletLedger): boolean =>
  [WalletLedger.Ledger, WalletLedger.LedgerLegacy].includes(wallet)

export const isCosmosWallet = (wallet: WalletLedger): boolean =>
  !isEthWallet(wallet)

const getInitialWallet = (args: WalletStrategyArguments): WalletLedger => {
  if (args.wallet) {
    return args.wallet
  }

  return args.ethereumOptions ? WalletLedger.Ledger : WalletLedger.LedgerCosmos
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
  wallet: WalletLedger
}): ConcreteWalletStrategy | undefined => {
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
    case WalletLedger.Ledger:
      return new LedgerLive(ethWalletArgs)
    case WalletLedger.LedgerLegacy:
      return new LedgerLegacy(ethWalletArgs)
    case WalletLedger.LedgerCosmos:
      return new LedgerCosmos({ ...args })
    default:
      return undefined
  }
}

const createStrategies = (
  args: WalletStrategyArguments,
): Record<Wallet, ConcreteWalletStrategy | undefined> => {
  return Object.values(WalletLedger).reduce(
    (strategies, wallet) => ({
      ...strategies,
      [wallet]: createStrategy({ wallet, args }),
    }),
    {} as Record<Wallet, ConcreteWalletStrategy | undefined>,
  )
}

export default class LedgerWalletStrategy {
  public strategies: Record<Wallet, ConcreteWalletStrategy | undefined>

  public wallet: WalletLedger

  public args: WalletStrategyArguments

  constructor(args: WalletStrategyArguments) {
    this.args = args
    this.strategies = createStrategies(args)
    this.wallet = getInitialWallet(args)
  }

  public getWallet(): WalletLedger {
    return this.wallet
  }

  public setWallet(wallet: WalletLedger) {
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
  public setOptions(_options?: WalletStrategyOptions) {
    // no-op to conform with prev interface
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
