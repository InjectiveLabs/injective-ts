import { ChainId, EvmChainId, AccountAddress } from '@injectivelabs/ts-types'
import type {
  TxRaw,
  TxResponse,
  AminoSignResponse,
  DirectSignResponse,
} from '@injectivelabs/sdk-ts'
import { StdSignDoc } from '@keplr-wallet/types'
import { WalletDeviceType, Wallet } from './enums.js'

export type onAccountChangeCallback = (account: string | string[]) => void
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

export type PrivateKeyMetadata = {
  privateKey: string
}

export type WalletConnectMetadata = {
  projectId?: string
}

export interface WalletStrategyEvmOptions {
  evmChainId: EvmChainId
  rpcUrl?: string
  rpcUrls?: Partial<Record<EvmChainId, string>>
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

export enum TurnkeyProvider {
  Email = 'email',
  Google = 'google',
  Apple = 'apple',
}

export type TurnkeySession = {
  sessionType: any
  userId: string
  organizationId: string
  expiry: number
  token: string
}

export interface TurnkeyMetadata {
  apiBaseUrl: string
  otpInitPath?: string
  otpVerifyPath?: string
  googleClientId?: string
  oauthLoginPath?: string
  session?: TurnkeySession
  apiServerEndpoint: string
  credentialBundle?: string
  googleRedirectUri?: string
  expirationSeconds?: string
  defaultOrganizationId: string
}

export interface WalletMetadata {
  magic?: MagicMetadata
  turnkey?: Partial<TurnkeyMetadata>
  walletConnect?: WalletConnectMetadata
  privateKey?: PrivateKeyMetadata
}

export interface ConcreteWalletStrategyArgs {
  chainId: ChainId
  metadata?: WalletMetadata
}

export interface ConcreteEvmWalletStrategyArgs
  extends ConcreteWalletStrategyArgs {
  evmOptions: WalletStrategyEvmOptions
}

export interface ConcreteCosmosWalletStrategyArgs
  extends ConcreteWalletStrategyArgs {
  wallet?: Wallet
}

export interface ConcreteCosmosWalletStrategy {
  metadata?: WalletMetadata

  setMetadata?(metadata?: WalletMetadata): void
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

  signCosmosTransaction(transaction: {
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
  metadata?: WalletMetadata
  evmOptions?: WalletStrategyEvmOptions
  disabledWallets?: Wallet[]
  wallet?: Wallet
  strategies: ConcreteStrategiesArg
}

export interface ConcreteWalletStrategy
  extends Omit<
    ConcreteCosmosWalletStrategy,
    'sendTransaction' | 'isChainIdSupported' | 'signAminoTransaction'
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
  sendEvmTransaction(
    transaction: unknown,
    options: { address: string; evmChainId: EvmChainId },
  ): Promise<string>

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
    signDoc: StdSignDoc
    address: string
  }): Promise<AminoSignResponse>

  /**
   * Sign EIP712 TypedData using the wallet provider
   * @param eip712TypedData
   * @param address - ethereum address
   */
  signEip712TypedData(eip712TypedData: string, address: string): Promise<string>

  signArbitrary(signer: string, data: string | Uint8Array): Promise<string>

  getEthereumChainId(): Promise<string>

  getEvmTransactionReceipt(txHash: string, evmChainId?: EvmChainId): void

  onAccountChange?(callback: onAccountChangeCallback): Promise<void> | void

  onChainIdChange?(callback: onChainIdChangeCallback): Promise<void> | void

  disconnect?(): Promise<void> | void

  getCosmosWallet?(chainId: ChainId): CosmosWalletAbstraction

  getWalletClient?<T>(): Promise<T>
}

export interface WalletStrategy {
  strategies: ConcreteStrategiesArg
  wallet: Wallet
  args: WalletStrategyArguments
  metadata?: WalletMetadata

  getWallet(): Wallet
  getWalletClient?<T>(): Promise<T>
  setWallet(wallet: Wallet): void
  setMetadata(metadata?: WalletMetadata): void
  getStrategy(): ConcreteWalletStrategy
  getAddresses(args?: unknown): Promise<AccountAddress[]>
  getWalletDeviceType(): Promise<WalletDeviceType>
  getPubKey(address?: string): Promise<string>
  enable(args?: unknown): Promise<boolean>
  enableAndGetAddresses(args?: unknown): Promise<AccountAddress[]>
  getEthereumChainId(): Promise<string>
  getEvmTransactionReceipt(
    txHash: string,
    evmChainId?: EvmChainId,
  ): Promise<void>
  getSessionOrConfirm(address?: AccountAddress): Promise<string>
  sendTransaction(
    tx: DirectSignResponse | TxRaw,
    options: SendTransactionOptions,
  ): Promise<TxResponse>
  sendEvmTransaction(
    tx: any,
    options: { address: AccountAddress; evmChainId: EvmChainId },
  ): Promise<string>
  signEip712TypedData(
    eip712TypedData: string,
    address: AccountAddress,
  ): Promise<string>
  signAminoCosmosTransaction(transaction: {
    signDoc: StdSignDoc
    address: string
  }): Promise<AminoSignResponse>
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

export { StdSignDoc }
