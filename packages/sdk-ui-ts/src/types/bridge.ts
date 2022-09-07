import {
  IBCTransferTx,
  PeggyDepositTx,
  PeggyWithdrawalTx,
} from '@injectivelabs/sdk-ts/dist/client'

export enum BridgingNetwork {
  Axelar = 'axelar',
  Chihuahua = 'chihuahua',
  CosmosHub = 'cosmosHub',
  Ethereum = 'ethereum',
  Evmos = 'evmos',
  Injective = 'injective',
  Juno = 'juno',
  Osmosis = 'osmosis',
  Persistence = 'Persistence',
  Terra = 'terra',
  Moonbeam = 'moonbeam',
  Secret = 'secret',
  Stride = 'stride',
}

export const MintScanExplorerUrl = {
  [BridgingNetwork.CosmosHub]: 'cosmos',
  [BridgingNetwork.Chihuahua]: 'chihuahua',
  [BridgingNetwork.Axelar]: 'axelar',
  [BridgingNetwork.Evmos]: 'evmos',
  [BridgingNetwork.Persistence]: 'persistence',
  [BridgingNetwork.Osmosis]: 'osmosis',
  [BridgingNetwork.Secret]: 'secret',
  [BridgingNetwork.Stride]: 'stride',
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
  symbol?: string
}

export interface NetworkConfig {
  network: BridgingNetwork
  denoms: string[]
  symbols: string[]
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

export interface PeggyTxResponse {
  denom: string
  amount: string
  receiver: string
  sender: string
  txHash: string
  bridgeFee?: string
}

export { IBCTransferTx, PeggyDepositTx, PeggyWithdrawalTx }
