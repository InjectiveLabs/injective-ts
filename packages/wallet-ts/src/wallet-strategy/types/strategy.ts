import {
  AccountAddress,
  ChainId,
  EthereumChainId,
} from '@injectivelabs/ts-types'
import type Web3 from 'web3'
import type { DirectSignResponse } from '@cosmjs/proto-signing'
import type { TxRaw } from '@injectivelabs/chain-api/cosmos/tx/v1beta1/tx_pb'

export type onAccountChangeCallback = (account: AccountAddress) => void
export type onChainIdChangeCallback = () => void

export enum LedgerDerivationPathType {
  LedgerLive = 'ledger-live',
  LedgerMew = 'ledger-mew',
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
    transaction: DirectSignResponse | TxRaw,
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

  signTransaction(
    data:
      | string /* EIP712 Typed Data in JSON */
      | { txRaw: TxRaw; accountNumber: number; chainId: string },
    address: AccountAddress,
  ): Promise<string | DirectSignResponse>

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
