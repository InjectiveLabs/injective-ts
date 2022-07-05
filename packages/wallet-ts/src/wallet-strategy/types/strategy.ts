import {
  AccountAddress,
  ChainId,
  EthereumChainId,
} from '@injectivelabs/ts-types'
import type Web3 from 'web3'

export type onAccountChangeCallback = (account: AccountAddress) => void
export type onChainIdChangeCallback = () => void

export enum LedgerDerivationPathType {
  LedgerLive = 'ledger-live',
  LedgerMew = 'ledger-mew',
}

export interface WalletOptions {
  rpcUrls: Record<EthereumChainId, string>
  wsRpcUrls: Record<EthereumChainId, string>
}

export interface ConcreteWalletStrategy {
  getAddresses(): Promise<string[]>

  confirm(address: AccountAddress): Promise<string>

  /**
   * Sends Cosmos transaction. Returns a transaction hash
   * @param transaction should implement TransactionConfig
   * @param options
   */
  sendTransaction(
    transaction: unknown,
    options: { address: string; chainId: ChainId },
  ): Promise<string>

  /**
   * Sends Ethereum transaction. Returns a transaction hash
   * @param transaction should implement TransactionConfig
   * @param options
   */
  sendEthereumTransaction(
    transaction: unknown,
    options: { address: string; ethereumChainId: EthereumChainId },
  ): Promise<string>

  signTransaction(eip712json: string, address: AccountAddress): Promise<string>

  getNetworkId(): Promise<string>

  getChainId(): Promise<string>

  getEthereumTransactionReceipt(txHash: string): void

  clearAddresses?(): void

  onAccountChange?(callback: onAccountChangeCallback): void

  onChainIdChange?(callback: onChainIdChangeCallback): void

  cancelOnChainIdChange?(): void

  cancelOnAccountChange?(): void

  cancelAllEvents?(): void

  disconnect?(): Promise<void>

  getWeb3(): Web3
}
