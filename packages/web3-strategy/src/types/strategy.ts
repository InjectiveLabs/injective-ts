import { AccountAddress } from '@injectivelabs/ts-types'
import { provider } from 'web3-core'

export type onAccountChangeCallback = (account: AccountAddress) => void
export type onChainIdChangeCallback = () => void

export interface ConcreteWeb3Strategy {
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
  isMetamask(): boolean
  getAddresses(): Promise<string[]>
  confirm(address: AccountAddress): Promise<string>
  sendTransaction(
    transaction: unknown,
    address: AccountAddress,
  ): Promise<string>
  signTypedDataV4(eip712json: string, address: AccountAddress): Promise<string>
  getNetworkId(): Promise<string>
  getChainId(): Promise<string>
  getTransactionReceipt(txHash: string): void
  onChainChanged(callback: onChainIdChangeCallback): void
  onAccountChanged(callback: onAccountChangeCallback): void
  isWeb3Connected(): boolean
}
