import {
  NetworkConfig,
  BridgeTransactionState,
  BridgingNetwork,
} from './../types/bridge'
import { convertTimestampToMilliseconds } from '@injectivelabs/utils'
import { isTestnet, Network } from '@injectivelabs/networks'
import { UiBridgeTransaction, MintScanExplorerUrl } from './../types/bridge'
import {
  PEGGY_GRAPH_URL,
  PEGGY_DEVNET_GRAPH_URL,
  PEGGY_DEVNET1_GRAPH_URL,
  PEGGY_DEVNET2_GRAPH_URL,
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
  BridgingNetwork.Stride,
  BridgingNetwork.Sommelier,
]

export const LeapNetworks = [
  BridgingNetwork.CosmosHub,
  BridgingNetwork.Osmosis,
  BridgingNetwork.Axelar,
  BridgingNetwork.Juno,
  BridgingNetwork.Persistence,
  BridgingNetwork.Stride,
  BridgingNetwork.Sommelier,
]

export const CosmostationNetworks = [
  BridgingNetwork.CosmosHub,
  BridgingNetwork.Chihuahua,
  BridgingNetwork.Osmosis,
  BridgingNetwork.Axelar,
  BridgingNetwork.Juno,
  BridgingNetwork.Persistence,
  BridgingNetwork.Evmos,
  BridgingNetwork.Secret,
  BridgingNetwork.Stride,
  BridgingNetwork.Crescent,
  BridgingNetwork.Sommelier,
]

export const CosmosNetworks = [
  BridgingNetwork.CosmosHub,
  BridgingNetwork.Chihuahua,
  BridgingNetwork.Crescent,
  BridgingNetwork.Osmosis,
  BridgingNetwork.Axelar,
  BridgingNetwork.Juno,
  BridgingNetwork.Persistence,
  BridgingNetwork.Evmos,
  BridgingNetwork.Secret,
  BridgingNetwork.Stride,
  BridgingNetwork.Sommelier,
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
  {
    network: BridgingNetwork.Stride,
    denoms: ['ustrd'],
    symbols: ['strd'],
  },
  {
    network: BridgingNetwork.Crescent,
    denoms: ['ucre', 'inj'],
    symbols: ['cre'],
  },
  {
    network: BridgingNetwork.Sommelier,
    denoms: ['usomm'],
    symbols: ['somm'],
  },
  {
    network: BridgingNetwork.EthereumWh,
    denoms: [],
    symbols: ['USDCet'],
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
  [CosmosChainId.Secret]: {
    ...tokenMetaUtil.getMetaBySymbol('SCRT'),
    tokenType: TokenType.Ibc,
    denom: 'uscrt',
  },
  [CosmosChainId.Stride]: {
    ...tokenMetaUtil.getMetaBySymbol('STRD'),
    tokenType: TokenType.Ibc,
    denom: 'ustrd',
  },
  [CosmosChainId.Crescent]: [
    {
      ...tokenMetaUtil.getMetaBySymbol('CRE'),
      tokenType: TokenType.Ibc,
      denom: 'ucre',
    },
    {
      ...tokenMetaUtil.getMetaBySymbol('INJ'),
      tokenType: TokenType.Ibc,
      denom:
        'ibc/5A76568E079A31FA12165E4559BA9F1E9D4C97F9C2060B538C84DCD503815E30',
    },
  ],
  [CosmosChainId.Sommelier]: {
    ...tokenMetaUtil.getMetaBySymbol('SOMM'),
    tokenType: TokenType.Ibc,
    denom: 'usomm',
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
  [BridgingNetwork.Crescent]:
    'ibc/5A76568E079A31FA12165E4559BA9F1E9D4C97F9C2060B538C84DCD503815E30',
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
  convertTimestampToMilliseconds(transaction.timeoutTimestamp) ===
    convertTimestampToMilliseconds(comparingTransaction.timeoutTimestamp)

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
      Network.Staging,
    ].includes(network)
  ) {
    return PEGGY_GRAPH_URL
  }

  if (isTestnet(network)) {
    return PEGGY_TESTNET_GRAPH_URL
  }

  if (network === Network.Devnet) {
    return PEGGY_DEVNET_GRAPH_URL
  }

  if (network === Network.Devnet1) {
    return PEGGY_DEVNET1_GRAPH_URL
  }

  if (network === Network.Devnet2) {
    return PEGGY_DEVNET2_GRAPH_URL
  }

  return ''
}

export const getNetworkFromAddress = (sender: string): BridgingNetwork => {
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

  if (sender.startsWith('stride')) {
    return BridgingNetwork.Stride
  }

  if (sender.startsWith('cre')) {
    return BridgingNetwork.Crescent
  }

  if (sender.startsWith('somm')) {
    return BridgingNetwork.Sommelier
  }

  if (sender.startsWith('0x')) {
    return BridgingNetwork.Ethereum
  }

  return BridgingNetwork.CosmosHub
}

export const getBridgeTransactionType = (
  srcNetwork: BridgingNetwork,
  dstNetwork: BridgingNetwork,
): `${BridgingNetwork}-${BridgingNetwork}` => {
  return `${srcNetwork}-${dstNetwork}` as `${BridgingNetwork}-${BridgingNetwork}`
}

export const getGasPriceForCosmosNetwork = (network: BridgingNetwork) => {
  switch (network) {
    case BridgingNetwork.Chihuahua:
      return 0.02
    case BridgingNetwork.CosmosHub:
      return 0.04
    case BridgingNetwork.Osmosis:
      return 0.04
    case BridgingNetwork.Crescent:
      return 0.02
    case BridgingNetwork.Stride:
      return 0.04
    case BridgingNetwork.Secret:
      return 0.25
    case BridgingNetwork.Persistence:
      return 0.04
    case BridgingNetwork.Evmos:
      return 0.01
    case BridgingNetwork.Axelar:
      return 0.01
    case BridgingNetwork.Juno:
      return 0.01
    default:
      return 0.01
  }
}

export const getGasPriceForChainId = (chainId: CosmosChainId) => {
  switch (chainId) {
    case CosmosChainId.Chihuahua:
      return 0.02
    case CosmosChainId.Cosmoshub:
      return 0.04
    case CosmosChainId.Osmosis:
      return 0.04
    case CosmosChainId.Crescent:
      return 0.02
    case CosmosChainId.Stride:
      return 0.04
    case CosmosChainId.Secret:
      return 0.25
    case CosmosChainId.Persistence:
      return 0.04
    case CosmosChainId.Evmos:
      return 0.01
    case CosmosChainId.Axelar:
      return 0.01
    case CosmosChainId.Juno:
      return 0.01
    case CosmosChainId.Injective:
      return 0.01
    default:
      return 0.01
  }
}
