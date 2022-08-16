import {
  NetworkConfig,
  BridgeTransactionState,
  BridgingNetwork,
} from './../types/bridge'
import { convertTimestampToMilliseconds } from '@injectivelabs/utils'
import { Network } from '@injectivelabs/networks'
import { UiBridgeTransaction, MintScanExplorerUrl } from './../types/bridge'
import {
  PEGGY_GRAPH_URL,
  PEGGY_DEVNET_GRAPH_URL,
  PEGGY_DEVNET1_GRAPH_URL,
  PEGGY_TESTNET_GRAPH_URL,
} from '../constants'
import { CosmosChainId, TestnetCosmosChainId } from '@injectivelabs/ts-types'
import { tokenMetaUtil, TokenType } from '@injectivelabs/token-metadata'
import { Token } from '@injectivelabs/token-metadata'

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
  BridgingNetwork.Secret,
]

export const tokenSelectorDisabledNetworks = [
  BridgingNetwork.Chihuahua,
  BridgingNetwork.CosmosHub,
  BridgingNetwork.Juno,
  BridgingNetwork.Evmos,
  BridgingNetwork.Persistence,
  BridgingNetwork.Moonbeam,
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
    denoms: ['uaxl', 'dot-planck'],
    symbols: ['axl', 'dot'],
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
  {
    network: BridgingNetwork.Moonbeam,
    denoms: ['dot-planck'],
    symbols: ['dot'],
  },
  {
    network: BridgingNetwork.Secret,
    denoms: ['uscrt'],
    symbols: ['scrt'],
  },
] as NetworkConfig[]

export const cosmosNativeDenomsFromChainId = {
  [CosmosChainId.Cosmoshub]: {
    ...tokenMetaUtil.getMetaBySymbol('ATOM'),
    tokenType: TokenType.Ibc,
    denom: 'uatom',
  },
  [CosmosChainId.Osmosis]: [
    {
      ...tokenMetaUtil.getMetaBySymbol('OSMO'),
      tokenType: TokenType.Ibc,
      denom: 'uosmo',
    },
    {
      ...tokenMetaUtil.getMetaBySymbol('INJ'),
      tokenType: TokenType.Ibc,
      denom:
        'ibc/64BA6E31FE887D66C6F8F31C7B1A80C7CA179239677B4088BB55F5EA07DBE273',
    },
  ],
  [CosmosChainId.Terra]: [
    {
      ...tokenMetaUtil.getMetaBySymbol('LUNA'),
      tokenType: TokenType.Ibc,
      denom: 'uluna',
    },
    {
      ...tokenMetaUtil.getMetaBySymbol('UST'),
      tokenType: TokenType.Ibc,
      denom: 'uusd',
    },
  ],
  [CosmosChainId.Injective]: {
    ...tokenMetaUtil.getMetaBySymbol('INJ'),
    tokenType: TokenType.Ibc,
    denom: 'inj',
  },
  [CosmosChainId.Chihuahua]: {
    ...tokenMetaUtil.getMetaBySymbol('HUAHUA'),
    tokenType: TokenType.Ibc,
    denom: 'uhuahua',
  },
  [CosmosChainId.Juno]: {
    ...tokenMetaUtil.getMetaBySymbol('JUNO'),
    tokenType: TokenType.Ibc,
    denom: 'ujuno',
  },
  [CosmosChainId.Axelar]: [
    {
      ...tokenMetaUtil.getMetaBySymbol('AXL'),
      tokenType: TokenType.Ibc,
      denom: 'uaxl',
    },
    {
      ...tokenMetaUtil.getMetaBySymbol('DOT'),
      tokenType: TokenType.Ibc,
      denom: 'dot-planck',
    },
  ],
  [CosmosChainId.Evmos]: {
    ...tokenMetaUtil.getMetaBySymbol('EVMOS'),
    tokenType: TokenType.Ibc,
    denom: 'aevmos',
  },
  [CosmosChainId.Persistence]: {
    ...tokenMetaUtil.getMetaBySymbol('XPRT'),
    tokenType: TokenType.Ibc,
    denom: 'uxprt',
  },
  [TestnetCosmosChainId.Cosmoshub]: {
    ...tokenMetaUtil.getMetaBySymbol('UPHOTON'),
    tokenType: TokenType.Ibc,
    denom: 'uphoton',
  },
  [TestnetCosmosChainId.Injective]: {
    ...tokenMetaUtil.getMetaBySymbol('INJ'),
    tokenType: TokenType.Ibc,
    denom: 'inj',
  },
} as Record<string, Token | Token[]>

export const ibcHashToNativeInjPerNetwork = {
  [BridgingNetwork.Osmosis]:
    'ibc/64BA6E31FE887D66C6F8F31C7B1A80C7CA179239677B4088BB55F5EA07DBE273',
  [BridgingNetwork.Persistence]:
    'ibc/D64E84758BCA42602C27E9ED2DB8F4EFDAE6A1E311CF404B516D45FEDF319D73',
} as Partial<Record<BridgingNetwork, string>>

const sameTxHash = (txHashOne: string, txHashTwo: string) =>
  txHashOne &&
  txHashTwo &&
  txHashOne.replace('0x', '').toLowerCase() ===
    txHashTwo.replace('0x', '').toLowerCase()

export const getCachedIBCTransactionState = (
  transaction: UiBridgeTransaction,
): BridgeTransactionState => {
  if (
    transaction.timeoutTimestamp &&
    transaction.state === BridgeTransactionState.Submitted
  ) {
    const now = Date.now()
    const bufferTime = 60 * 1000 // hardcode to 1 minute
    const timeoutTimestampWithBuffer =
      convertTimestampToMilliseconds(
        parseInt(transaction.timeoutTimestamp, 10),
      ) + bufferTime

    if (now >= timeoutTimestampWithBuffer) {
      return BridgeTransactionState.Failed
    }

    return BridgeTransactionState.Submitted
  }

  return transaction.state as BridgeTransactionState
}

export const findEthereumTransactionByNonce = (
  transaction: UiBridgeTransaction,
  comparingTransaction: UiBridgeTransaction,
) =>
  transaction.nonce &&
  comparingTransaction.nonce &&
  transaction.nonce === comparingTransaction.nonce

export const findEthereumTransactionByTxHash = (
  transaction: UiBridgeTransaction,
  comparingTransaction: UiBridgeTransaction,
) =>
  transaction.txHash &&
  comparingTransaction.txHash &&
  sameTxHash(transaction.txHash, comparingTransaction.txHash)

export const findEthereumTransactionByTxHashes = (
  transaction: UiBridgeTransaction,
  comparingTransaction: UiBridgeTransaction,
) =>
  transaction.txHashes &&
  transaction.txHashes.find((hash: string) =>
    sameTxHash(hash, comparingTransaction.txHash),
  ) !== undefined

export const findIBCTransactionByTimeoutTimestamp = (
  transaction: UiBridgeTransaction,
  comparingTransaction: UiBridgeTransaction,
) =>
  transaction.sender === comparingTransaction.sender &&
  transaction.receiver === comparingTransaction.receiver &&
  transaction.timeoutTimestamp &&
  comparingTransaction.timeoutTimestamp &&
  transaction.timeoutTimestamp.toString() ===
    comparingTransaction.timeoutTimestamp.toString()

export const ibcTxNotPartOfInjectiveIbcTxs =
  (injectiveIbcTransactions: UiBridgeTransaction[]) =>
  (transaction: UiBridgeTransaction) =>
    injectiveIbcTransactions.find((injectiveIbcTransaction) =>
      findIBCTransactionByTimeoutTimestamp(
        injectiveIbcTransaction,
        transaction,
      ),
    ) === undefined

export const txNotPartOfPeggoDeposit =
  (peggoDepositTxs: UiBridgeTransaction[]) =>
  (transaction: UiBridgeTransaction) =>
    peggoDepositTxs.find((peggoDepositTx) =>
      findEthereumTransactionByTxHash(peggoDepositTx, transaction),
    ) === undefined

export const txNotPartOfInjectivePeggyTxs =
  (injectivePeggyTransactions: UiBridgeTransaction[]) =>
  (transaction: UiBridgeTransaction) =>
    injectivePeggyTransactions.find(
      (injectiveTransaction) =>
        findEthereumTransactionByNonce(injectiveTransaction, transaction) ||
        findEthereumTransactionByTxHashes(injectiveTransaction, transaction) ||
        findEthereumTransactionByTxHash(injectiveTransaction, transaction),
    ) === undefined

export const getExplorerUrl = (network: Network): string => {
  switch (network) {
    case Network.Devnet:
      return 'https://devnet.explorer.injective.dev'
    case Network.Mainnet:
      return 'https://explorer.injective.network'
    case Network.Public:
      return 'https://explorer.injective.network'
    case Network.Local:
      return 'https://devnet.explorer.injective.dev'
    case Network.Testnet:
      return 'https://testnet.explorer.injective.dev'
    default:
      return 'https://explorer.injective.network'
  }
}

export const getCosmosExplorerUrl = (
  bridgingNetwork: BridgingNetwork = BridgingNetwork.CosmosHub,
  network: Network,
): string => {
  const mintScanNetworkUrl = MintScanExplorerUrl[bridgingNetwork]

  switch (network) {
    case Network.Devnet:
      return `https://dev.mintscan.io/${mintScanNetworkUrl}-testnet`
    case Network.Mainnet:
      return `https://www.mintscan.io/${mintScanNetworkUrl}`
    case Network.Public:
      return `https://www.mintscan.io/${mintScanNetworkUrl}`
    case Network.Local:
      return `https://dev.mintscan.io/${mintScanNetworkUrl}-testnet`
    case Network.Testnet:
      return `https://testnet.mintscan.io/${mintScanNetworkUrl}-testnet`
    default:
      return `https://www.mintscan.io/${mintScanNetworkUrl}`
  }
}

export const getEthereumExplorerUrl = (network: Network): string => {
  switch (network) {
    case Network.Devnet:
      return 'https://goerli.etherscan.io'
    case Network.Mainnet:
      return 'https://etherscan.io'
    case Network.Public:
      return 'https://etherscan.io'
    case Network.Local:
      return 'https://goerli.etherscan.io'
    case Network.Testnet:
      return 'https://goerli.etherscan.io'
    default:
      return 'https://etherscan.io'
  }
}

export const getTerraExplorerUrl = (network: Network): string => {
  switch (network) {
    case Network.Devnet:
      return 'https://finder.terra.money/localterra'
    case Network.Mainnet:
      return 'https://finder.terra.money/mainnet'
    case Network.Public:
      return 'https://finder.terra.money/mainnet'
    case Network.Local:
      return 'https://finder.terra.money/localterra'
    case Network.Testnet:
      return 'https://finder.terra.money/testnet/'
    default:
      return 'https://finder.terra.money/mainnet'
  }
}

export const getPeggoGraphQlEndpoint = (network: Network): string => {
  if (
    [
      Network.Mainnet,
      Network.MainnetK8s,
      Network.Public,
      Network.MainnetOld,
      Network.MainnetStaging,
      Network.Staging,
    ].includes(network)
  ) {
    return PEGGY_GRAPH_URL
  }

  if ([Network.Testnet, Network.TestnetK8s].includes(network)) {
    return PEGGY_TESTNET_GRAPH_URL
  }

  if (network === Network.Devnet) {
    return PEGGY_DEVNET_GRAPH_URL
  }

  if (network === Network.Devnet1) {
    return PEGGY_DEVNET1_GRAPH_URL
  }

  return ''
}

export const getNetworkFromSender = (sender: string): BridgingNetwork => {
  if (sender.startsWith('juno')) {
    return BridgingNetwork.Juno
  }

  if (sender.startsWith('terra')) {
    return BridgingNetwork.Terra
  }

  if (sender.startsWith('osmo')) {
    return BridgingNetwork.Osmosis
  }

  if (sender.startsWith('chihuahua')) {
    return BridgingNetwork.Chihuahua
  }

  if (sender.startsWith('axelar')) {
    return BridgingNetwork.Axelar
  }

  if (sender.startsWith('evmos')) {
    return BridgingNetwork.Evmos
  }

  if (sender.startsWith('persistence')) {
    return BridgingNetwork.Persistence
  }

  if (sender.startsWith('secret')) {
    return BridgingNetwork.Secret
  }

  return BridgingNetwork.CosmosHub
}
