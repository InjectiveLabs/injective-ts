import { AccountAddress, ChainId } from '@injectivelabs/ts-types'
import Web3 from 'web3'
import { provider } from 'web3-core'

export type onAccountChangeCallback = (account: AccountAddress) => void
export type onChainIdChangeCallback = () => void

export interface ConcreteWeb3Strategy {
  web3ForChainId: Record<ChainId, Web3>

  web3WsForChainId: Record<ChainId, Web3>

  getWeb3ProviderEngineForRpc({
    rpcUrl,
    pollingInterval,
  }: {
    rpcUrl: string
    pollingInterval: number
  }): provider

  getWeb3WsProviderEngineForRpc({
    wsRpcUrl,
    pollingInterval,
  }: {
    wsRpcUrl: string
    pollingInterval: number
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

  onChainChanged(callback: onChainIdChangeCallback): void

  onAccountChanged(callback: onAccountChangeCallback): void

  isWeb3Connected(): boolean
}
