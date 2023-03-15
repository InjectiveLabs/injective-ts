import { DirectSignResponse } from '@cosmjs/proto-signing'
import {
  ChainId,
  CosmosChainId,
  EthereumChainId,
} from '@injectivelabs/ts-types'
import { TxRaw, TxResponse } from '@injectivelabs/sdk-ts'
import type Web3 from 'web3'
import { AminoSignResponse, StdSignDoc } from '@keplr-wallet/types'
import { Wallet, WalletDeviceType } from '../../types/enums'

export type onAccountChangeCallback = (account: string) => void
export type onChainIdChangeCallback = () => void

export interface WalletStrategyEthereumOptions {
  ethereumChainId: EthereumChainId
  rpcUrl: string
  wsRpcUrl: string
}

export interface EthereumWalletStrategyArgs {
  chainId: ChainId
  ethereumOptions: WalletStrategyEthereumOptions
  web3: Web3
}

export interface ConcreteCosmosWalletStrategy {
  /**
   * The the accounts from the wallet (addresses)
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
  getPubKey(): Promise<string>

  /**
   * Sends Cosmos transaction. Returns a transaction hash
   * @param transaction should implement TransactionConfig
   * @param options
   */
  sendTransaction(transaction: DirectSignResponse | TxRaw): Promise<TxResponse>

  isChainIdSupported(chainId?: CosmosChainId): Promise<boolean>

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

export interface CosmosWalletStrategyArguments {
  chainId: CosmosChainId
  endpoints?: { rpc: string; rest: string }
  wallet?: Wallet
}

export interface WalletStrategyArguments
  extends Omit<CosmosWalletStrategyArguments, 'endpoints' | 'chainId'> {
  chainId: ChainId
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
    options: { address: string; chainId: ChainId },
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
   * Sign EIP712 TypedData using the wallet provider
   * @param eip712TypedData
   * @param address - ethereum address
   */
  signEip712TypedData(eip712TypedData: string, address: string): Promise<string>

  getNetworkId(): Promise<string>

  getChainId(): Promise<string>

  getEthereumTransactionReceipt(txHash: string): void

  onAccountChange?(callback: onAccountChangeCallback): void

  onChainIdChange?(callback: onChainIdChangeCallback): void

  cancelOnChainIdChange?(): void

  cancelOnAccountChange?(): void

  cancelAllEvents?(): void

  disconnect?(): Promise<void>

  getWeb3(): Web3
}
