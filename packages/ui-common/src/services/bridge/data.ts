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
  BridgingNetwork.Juno,
  BridgingNetwork.Persistence,
  BridgingNetwork.Evmos,
]

export const tokenSelectorDisabledNetworks = [
  BridgingNetwork.Chihuahua,
  BridgingNetwork.CosmosHub,
  BridgingNetwork.Juno,
  BridgingNetwork.Evmos,
  BridgingNetwork.Persistence,
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
    network: BridgingNetwork.Juno,
    denoms: ['ujuno'],
    symbols: ['juno'],
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
  {
    network: BridgingNetwork.Evmos,
    denoms: ['uevmos'],
    symbols: ['evmos'],
  },
  {
    network: BridgingNetwork.Persistence,
    denoms: ['uxprt', 'inj'],
    symbols: ['xprt'],
  },
] as NetworkConfig[]

export const ibcHashToNativeInjPerNetwork = {
  [BridgingNetwork.Osmosis]:
    'ibc/64BA6E31FE887D66C6F8F31C7B1A80C7CA179239677B4088BB55F5EA07DBE273',
  [BridgingNetwork.Persistence]:
    'ibc/D64E84758BCA42602C27E9ED2DB8F4EFDAE6A1E311CF404B516D45FEDF319D73',
} as Partial<Record<BridgingNetwork, string>>
