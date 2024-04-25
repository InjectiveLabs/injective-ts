import type { DirectSignResponse } from '@cosmjs/proto-signing'
import {
  ChainId,
  CosmosChainId,
  EthereumChainId,
} from '@injectivelabs/ts-types'
import type { TxRaw, TxResponse } from '@injectivelabs/sdk-ts'
import { AminoSignResponse, StdSignDoc } from '@keplr-wallet/types'
import { Wallet, WalletDeviceType } from '../../types/enums'
import { SendTransactionOptions } from '../wallet-strategy'

export type onAccountChangeCallback = (account: string) => void
export type onChainIdChangeCallback = () => void

export interface WalletStrategyEthereumOptions {
  ethereumChainId: EthereumChainId
  rpcUrl?: string
}

export interface EthereumWalletStrategyArgs {
  chainId: ChainId
  ethereumOptions: WalletStrategyEthereumOptions
}

export interface ConcreteCosmosWalletStrategy {
  /**
   * The accounts from the wallet (addresses)
   */
  getAddresses(): Promise<string[]>

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
  enable(): Promise<boolean>

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

export interface WalletStrategyOptions {
  privateKey?: string
}

export interface CosmosWalletStrategyArguments {
  chainId: CosmosChainId
  wallet?: Wallet
}

export interface WalletStrategyArguments
  extends Omit<CosmosWalletStrategyArguments, 'chainId'> {
  chainId: ChainId
  options?: WalletStrategyOptions
  ethereumOptions?: WalletStrategyEthereumOptions
  disabledWallets?: Wallet[]
  wallet?: Wallet
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
  confirm(address: string): Promise<string>

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
}
