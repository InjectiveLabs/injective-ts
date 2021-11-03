import { AccountAddress, ChainId } from '@injectivelabs/ts-types'
import Web3 from 'web3'
import { provider } from 'web3-core'

export type onAccountChangeCallback = (account: AccountAddress) => void
export type onChainIdChangeCallback = () => void

export enum LedgerDerivationPathType {
  LedgerLive = 'ledger-live',
  LedgerMew = 'ledger-mew',
}

export interface ConcreteStrategyOptions {
  privateKey?: string
  baseDerivationPath?: string
  derivationPathType?: LedgerDerivationPathType
  rpcUrls?: Record<ChainId, string>
  wsRpcUrls?: Record<ChainId, string>
  pollingInterval: number
  blockTracker?: boolean
}

export interface ConcreteWeb3Strategy {
  web3ForChainId: Record<ChainId, Web3>

  web3WsForChainId: Record<ChainId, Web3>

  getWeb3ProviderEngineForRpc({
    rpcUrl,
    pollingInterval,
    blockTracker,
  }: {
    rpcUrl: string
    pollingInterval: number
    blockTracker?: any
  }): provider

  getWeb3WsProviderEngineForRpc({
    wsRpcUrl,
    pollingInterval,
    blockTracker,
  }: {
    wsRpcUrl: string
    pollingInterval: number
    blockTracker?: any
  }): provider

  getWeb3(): Web3

  getWeb3ForChainId(chainId: ChainId): Web3

  getWeb3Ws(): Web3

  getWeb3WsForChainId(chainId: ChainId): Web3

  isMetamask(): boolean

  getAddresses(): Promise<string[]>

  confirm(address: AccountAddress): Promise<string>

  sendTransaction(
    transaction: unknown,
    options: { address: string; chainId: ChainId },
  ): Promise<string>

  signTypedDataV4(eip712json: string, address: AccountAddress): Promise<string>

  getNetworkId(): Promise<string>

  getChainId(): Promise<string>

  getTransactionReceipt(txHash: string): void

  onAccountChange?(callback: onAccountChangeCallback): void

  onChainIdChange?(callback: onChainIdChangeCallback): void

  cancelOnChainIdChange?(): void

  cancelOnAccountChange?(): void

  cancelAllEvents?(): void

  isWeb3Connected(): boolean
}
