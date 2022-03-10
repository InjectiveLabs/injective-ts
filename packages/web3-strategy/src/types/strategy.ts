import { AccountAddress, ChainId } from '@injectivelabs/ts-types'

export type onAccountChangeCallback = (account: AccountAddress) => void
export type onChainIdChangeCallback = () => void

export enum LedgerDerivationPathType {
  LedgerLive = 'ledger-live',
  LedgerMew = 'ledger-mew',
}

export interface Web3Options {
  rpcUrl: string
  wsRpcUrl: string
}

export interface ConcreteWeb3Strategy {
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
