import { NetworkConfig, BridgeTransactionState, BridgingNetwork } from './types'

export const InProgressStates = [
  BridgeTransactionState.Confirming,
  BridgeTransactionState.Submitted,
  BridgeTransactionState.InjectiveConfirming,
  BridgeTransactionState.EthereumConfirming,
]

export const FailedStates = [
  BridgeTransactionState.Cancelled,
  BridgeTransactionState.Failed,
]

export const KeplrNetworks = [
  BridgingNetwork.CosmosHub,
  BridgingNetwork.Chihuahua,
  BridgingNetwork.Osmosis,
  BridgingNetwork.Axelar,
]

export const tokenSelectorDisabledNetworks = [
  BridgingNetwork.Chihuahua,
  BridgingNetwork.CosmosHub,
]

export const tokenDenomsPerNetwork = [
  {
    network: BridgingNetwork.Osmosis,
    denoms: ['uosmo', 'inj'],
    symbols: ['osmo'],
  },
  {
    network: BridgingNetwork.Chihuahua,
    denoms: ['uhuahua'],
    symbols: ['huahua'],
  },
  {
    network: BridgingNetwork.Axelar,
    denoms: ['uaxl'],
    symbols: ['axl'],
  },
  {
    network: BridgingNetwork.CosmosHub,
    denoms: ['uatom', 'uphoton'],
    symbols: ['atom', 'uphoton'],
  },
  {
    network: BridgingNetwork.Terra,
    denoms: ['uluna', 'uusd'],
    symbols: ['luna', 'ust'],
  },
] as NetworkConfig[]
