import { TokenMeta } from '@injectivelabs/token-metadata'
import {
  IBCTransferTx,
  PeggyDepositTx,
  PeggyWithdrawalTx,
} from '@injectivelabs/exchange-consumer'

export enum BridgingNetwork {
  CosmosHub = 'cosmosHub',
  Chihuahua = 'chihuahua',
  Osmosis = 'osmosis',
  Terra = 'terra',
  Ethereum = 'ethereum',
  Juno = 'juno',
  Axelar = 'axelar',
  Injective = 'injective',
}

export const MintScanExplorerUrl = {
  [BridgingNetwork.CosmosHub]: 'cosmos',
  [BridgingNetwork.Chihuahua]: 'chihuahua',
  [BridgingNetwork.Axelar]: 'axelar',
  [BridgingNetwork.Osmosis]: 'osmosis',
} as Record<BridgingNetwork, string>

export enum BridgeTransactionState {
  Cancelled = 'Cancelled',
  Completed = 'Completed',
  Confirm = 'Confirming',
  Confirming = 'Confirming',
  EthereumConfirming = 'EthereumConfirming',
  Failed = 'Failed',
  InjectiveConfirming = 'InjectiveConfirming',
  Submitted = 'Submitted',
  FailedCancelled = 'failed-cancelled',
  InProgress = 'in-progress',
}

export enum BridgeProgress {
  EthereumDepositInitiated = 1,
  EthereumConfirming = 2,
  InjectiveConfirming = 3,
  EthereumDepositCompleted = 4,
  InProgress = 1,
  Completed = 2,
}

export interface NetworkMeta {
  text: string
  value: string
  icon: string
}

export interface NetworkConfig {
  network: BridgingNetwork
  denoms: string[]
  symbols: string[]
}
export interface TokenMetaWithUsdPrice extends TokenMeta {
  usdPrice?: number
}

export interface UiBridgeTransaction {
  amount: string
  denom: string
  receiver: string
  sender: string
  txHash: string
  explorerLink: string
  timestamp: number
  state: BridgeTransactionState
  blockHeight?: number
  nonce?: number
  bridgeFee?: string
  timeoutTimestamp?: string
  txHashes?: string[]
}

export { IBCTransferTx, PeggyDepositTx, PeggyWithdrawalTx }
