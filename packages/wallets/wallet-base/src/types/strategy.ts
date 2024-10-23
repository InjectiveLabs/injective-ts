import type { DirectSignResponse } from '@cosmjs/proto-signing'
import {
  ChainId,
  CosmosChainId,
  AccountAddress,
  EthereumChainId,
} from '@injectivelabs/ts-types'
import type { TxRaw, TxResponse } from '@injectivelabs/sdk-ts'
import { AminoSignResponse, StdSignDoc } from '@keplr-wallet/types'
import { WalletDeviceType, Wallet } from './enums'

export type onAccountChangeCallback = (account: string) => void
export type onChainIdChangeCallback = () => void

export type CosmosWalletAbstraction = {
  enableGasCheck?(chainId: ChainId): Promise<void> | void
  disableGasCheck?(chainId: ChainId): Promise<void> | void
  signEIP712CosmosTx(args: {
    signDoc: StdSignDoc
    eip712: any
  }): Promise<AminoSignResponse>
}

export type MagicMetadata = {
  apiKey?: string
  rpcEndpoint?: string
}

export type WalletConnectMetadata = Record<
  string,
  string | Record<string, string> | Record<string, string[]>
>

export interface WalletStrategyEthereumOptions {
  ethereumChainId: EthereumChainId
  rpcUrl?: string
}

export interface SendTransactionOptions {
  address: string
  chainId: ChainId
  txTimeout?: number
  endpoints: {
    rest: string
    grpc: string
    tm?: string
  }
}

export interface ConcreteWalletStrategyOptions {
  privateKey?: string
  metadata?: Record<string, string | Record<string, string>>
}

export interface ConcreteWalletStrategyArgs {
  chainId: ChainId
  options?: ConcreteWalletStrategyOptions
}

export interface ConcreteCosmosWalletStrategyArgs {
  chainId: CosmosChainId | ChainId
  wallet?: Wallet
  options?: ConcreteWalletStrategyOptions
}

export interface ConcreteEthereumWalletStrategyArgs
  extends ConcreteWalletStrategyArgs {
  ethereumOptions: WalletStrategyEthereumOptions
}

export interface ConcreteCosmosWalletStrategy {
  /**
   * The accounts from the wallet (addresses)
   */
  getAddresses(args?: unknown): Promise<string[]>

  /**
   * Return the WalletDeviceType connected on the
   * wallet provider (extension, mobile, hardware wallet)
   */
  getWalletDeviceType(): Promise<WalletDeviceType>

  /**
   * Get the PubKey from the wallet
   * in base64 for Cosmos native wallets
   */
  getPubKey(address?: string): Promise<string>

  /**
   * Perform validations and checks
   * for the wallet (if the chain is supported, etc)
   */
  enable(args?: unknown): Promise<boolean>

  /**
   * Sends Cosmos transaction. Returns a transaction hash
   * @param transaction should implement TransactionConfig
   * @param options
   */
  sendTransaction(
    transaction: DirectSignResponse | TxRaw,
    options: SendTransactionOptions,
  ): Promise<TxResponse>

  signTransaction(transaction: {
    txRaw: TxRaw
    chainId: string
    accountNumber: number
    address: string
  }): Promise<DirectSignResponse>

  signAminoTransaction(transaction: {
    stdSignDoc: StdSignDoc
    address: string
  }): Promise<AminoSignResponse>
}

export type ConcreteStrategiesArg = {
  [key in Wallet]?: ConcreteWalletStrategy
}

export interface WalletStrategyArguments {
  chainId: ChainId
  options?: ConcreteWalletStrategyOptions
  ethereumOptions?: WalletStrategyEthereumOptions
  disabledWallets?: Wallet[]
  wallet?: Wallet
  strategies: ConcreteStrategiesArg
}

export interface ConcreteWalletStrategy
  extends Omit<
    ConcreteCosmosWalletStrategy,
    | 'sendTransaction'
    | 'signTransaction'
    | 'isChainIdSupported'
    | 'signAminoTransaction'
  > {
  /**
   * Sends Cosmos transaction. Returns a transaction hash
   * @param transaction should implement TransactionConfig
   * @param options
   */
  sendTransaction(
    transaction: DirectSignResponse | TxRaw,
    options: {
      address: string
      chainId: ChainId
      txTimeout?: number
      endpoints?: {
        rest: string
        grpc: string
        tm?: string
      }
    },
  ): Promise<TxResponse>

  /**
   * Confirm the address on the wallet
   * @param address address
   */
  getSessionOrConfirm(address?: string): Promise<string>

  /**
   * Sends Ethereum transaction. Returns a transaction hash
   * @param transaction should implement TransactionConfig
   * @param options
   */
  sendEthereumTransaction(
    transaction: unknown,
    options: { address: string; ethereumChainId: EthereumChainId },
  ): Promise<string>

  /** @deprecated * */
  signTransaction(
    data:
      | string /* EIP712 Typed Data in JSON */
      | { txRaw: TxRaw; accountNumber: number; chainId: string },
    address: string,
  ): Promise<string | DirectSignResponse>

  /**
   * Sign a cosmos transaction using the wallet provider
   *
   * @param transaction
   * @param address - injective address
   */
  signCosmosTransaction(transaction: {
    txRaw: TxRaw
    accountNumber: number
    chainId: string
    address: string
  }): Promise<DirectSignResponse>

  /**
   * Sign an amino sign doc using the wallet provider
   *
   * @param transaction
   * @param address - injective address
   */
  signAminoCosmosTransaction(transaction: {
    signDoc: any
    accountNumber: number
    chainId: string
    address: string
  }): Promise<string>

  /**
   * Sign EIP712 TypedData using the wallet provider
   * @param eip712TypedData
   * @param address - ethereum address
   */
  signEip712TypedData(eip712TypedData: string, address: string): Promise<string>

  signArbitrary(signer: string, data: string | Uint8Array): Promise<string>

  getEthereumChainId(): Promise<string>

  getEthereumTransactionReceipt(txHash: string): void

  onAccountChange?(callback: onAccountChangeCallback): Promise<void> | void

  onChainIdChange?(callback: onChainIdChangeCallback): Promise<void> | void

  disconnect?(): Promise<void> | void

  getCosmosWallet?(chainId: ChainId): CosmosWalletAbstraction
}

export interface WalletStrategy {
  strategies: ConcreteStrategiesArg
  wallet: Wallet
  args: WalletStrategyArguments

  getWallet(): Wallet
  setWallet(wallet: Wallet): void
  setOptions(options?: ConcreteWalletStrategyOptions): void
  getStrategy(): ConcreteWalletStrategy
  getAddresses(args?: unknown): Promise<AccountAddress[]>
  getWalletDeviceType(): Promise<WalletDeviceType>
  getPubKey(address?: string): Promise<string>
  enable(args?: unknown): Promise<boolean>
  enableAndGetAddresses(args?: unknown): Promise<AccountAddress[]>
  getEthereumChainId(): Promise<string>
  getEthereumTransactionReceipt(txHash: string): Promise<void>
  getSessionOrConfirm(address?: AccountAddress): Promise<string>
  sendTransaction(
    tx: DirectSignResponse | TxRaw,
    options: SendTransactionOptions,
  ): Promise<TxResponse>
  sendEthereumTransaction(
    tx: any,
    options: { address: AccountAddress; ethereumChainId: EthereumChainId },
  ): Promise<string>
  signTransaction(
    data: string | { txRaw: TxRaw; accountNumber: number; chainId: string },
    address: AccountAddress,
  ): Promise<string | DirectSignResponse>
  signEip712TypedData(
    eip712TypedData: string,
    address: AccountAddress,
  ): Promise<string>
  signAminoCosmosTransaction(transaction: {
    signDoc: any
    accountNumber: number
    chainId: string
    address: string
  }): Promise<string>
  signCosmosTransaction(transaction: {
    txRaw: TxRaw
    accountNumber: number
    chainId: string
    address: string
  }): Promise<DirectSignResponse>
  signArbitrary(
    signer: string,
    data: string | Uint8Array,
  ): Promise<string | void>
  onAccountChange(callback: onAccountChangeCallback): Promise<void>
  onChainIdChange(callback: onChainIdChangeCallback): Promise<void>
  disconnect(): Promise<void>
  getCosmosWallet?(chainId: ChainId): CosmosWalletAbstraction
}
