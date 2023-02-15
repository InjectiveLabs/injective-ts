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
import { Token, tokenMetaUtils, TokenType } from '@injectivelabs/token-metadata'

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
  BridgingNetwork.CosmosHubTestnet,
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
  BridgingNetwork.CosmosHubTestnet,
  BridgingNetwork.Juno,
  BridgingNetwork.Evmos,
  BridgingNetwork.Persistence,
  BridgingNetwork.Moonbeam,
]

export const tokenDenomsPerNetwork = [
  {
    network: BridgingNetwork.CosmosHub,
    denoms: [
      'ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9',
    ],
    symbols: ['atom'],
  },
  {
    network: BridgingNetwork.Osmosis,
    denoms: [
      'inj',
      'ibc/92E0120F15D037353CFB73C14651FC8930ADC05B93100FD7754D3A689E53B333',
    ],
    symbols: ['osmo', 'inj'],
  },
  {
    network: BridgingNetwork.Chihuahua,
    denoms: [
      'ibc/E7807A46C0B7B44B350DA58F51F278881B863EC4DCA94635DAB39E52C30766CB',
    ],
    symbols: ['huahua'],
  },
  {
    network: BridgingNetwork.Axelar,
    denoms: [
      'dot-planck',
      'ibc/B68C1D2682A8B69E20BB921E34C6A3A2B6D1E13E3E8C0092E373826F546DEE65',
    ],
    symbols: ['axl', 'dot'],
  },
  {
    network: BridgingNetwork.Juno,
    denoms: [
      'ibc/D50E26996253EBAA8C684B9CD653FE2F7665D7BDDCA3D48D5E1378CF6334F211',
    ],
    symbols: ['juno'],
  },
  {
    network: BridgingNetwork.Terra,
    denoms: [
      'ibc/B8AF5D92165F35AB31F3FC7C7B444B9D240760FA5D406C49D24862BD0284E395',
      'ibc/B448C0CA358B958301D328CCDC5D5AD642FC30A6D3AE106FF721DB315F3DDE5C',
    ],
    symbols: ['luna', 'ust'],
  },
  {
    network: BridgingNetwork.Evmos,
    denoms: [
      'ibc/16618B7F7AC551F48C057A13F4CA5503693FBFF507719A85BC6876B8BD75F821',
    ],
    symbols: ['evmos'],
  },
  {
    network: BridgingNetwork.Persistence,
    denoms: [
      'inj',
      'ibc/B786E7CBBF026F6F15A8DA248E0F18C62A0F7A70CB2DABD9239398C8B5150ABB',
    ],
    symbols: ['xprt'],
  },
  {
    network: BridgingNetwork.Moonbeam,
    denoms: ['dot-planck'],
    symbols: ['dot'],
  },
  {
    network: BridgingNetwork.Secret,
    denoms: [
      'ibc/0954E1C28EB7AF5B72D24F3BC2B47BBB2FDF91BDDFD57B74B99E133AED40972A',
    ],
    symbols: ['scrt'],
  },
  {
    network: BridgingNetwork.Stride,
    denoms: ['ustrd'],
    symbols: ['strd'],
  },
  {
    network: BridgingNetwork.Crescent,
    denoms: [
      'inj',
      'ibc/3A6DD3358D9F7ADD18CDE79BA10B400511A5DE4AE2C037D7C9639B52ADAF35C6',
    ],
    symbols: ['cre'],
  },
  {
    network: BridgingNetwork.Sommelier,
    denoms: [
      'ibc/34346A60A95EB030D62D6F5BDD4B745BE18E8A693372A8A347D5D53DBBB1328B',
    ],
    symbols: ['somm'],
  },
  {
    network: BridgingNetwork.CosmosHubTestnet,
    denoms: [
      'ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9',
    ],
    symbols: ['uphoton'],
  },
  {
    network: BridgingNetwork.Solana,
    denoms: [],
    symbols: ['SOL'],
  },
  {
    network: BridgingNetwork.EthereumWh,
    denoms: [],
    symbols: ['USDCet', 'CHZ'],
  },
] as NetworkConfig[]

export const cosmosNativeDenomsFromChainId = {
  [CosmosChainId.Cosmoshub]: {
    ...tokenMetaUtils.getMetaBySymbol('ATOM'),
    tokenType: TokenType.Ibc,
    denom:
      'ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9',
  },
  [CosmosChainId.Osmosis]: [
    {
      ...tokenMetaUtils.getMetaBySymbol('OSMO'),
      tokenType: TokenType.Ibc,
      denom:
        'ibc/92E0120F15D037353CFB73C14651FC8930ADC05B93100FD7754D3A689E53B333',
    },
    {
      ...tokenMetaUtils.getMetaBySymbol('INJ'),
      tokenType: TokenType.Ibc,
      denom: 'inj',
    },
  ],
  [CosmosChainId.Terra]: [
    {
      ...tokenMetaUtils.getMetaBySymbol('LUNA'),
      tokenType: TokenType.Ibc,
      denom:
        'ibc/B8AF5D92165F35AB31F3FC7C7B444B9D240760FA5D406C49D24862BD0284E395',
    },
    {
      ...tokenMetaUtils.getMetaBySymbol('UST'),
      tokenType: TokenType.Ibc,
      denom:
        'ibc/B448C0CA358B958301D328CCDC5D5AD642FC30A6D3AE106FF721DB315F3DDE5C',
    },
  ],
  [CosmosChainId.Injective]: {
    ...tokenMetaUtils.getMetaBySymbol('INJ'),
    tokenType: TokenType.Ibc,
    denom: 'inj',
  },
  [CosmosChainId.Chihuahua]: {
    ...tokenMetaUtils.getMetaBySymbol('HUAHUA'),
    tokenType: TokenType.Ibc,
    denom:
      'ibc/E7807A46C0B7B44B350DA58F51F278881B863EC4DCA94635DAB39E52C30766CB',
  },
  [CosmosChainId.Juno]: {
    ...tokenMetaUtils.getMetaBySymbol('JUNO'),
    tokenType: TokenType.Ibc,
    denom:
      'ibc/D50E26996253EBAA8C684B9CD653FE2F7665D7BDDCA3D48D5E1378CF6334F211',
  },
  [CosmosChainId.Axelar]: [
    {
      ...tokenMetaUtils.getMetaBySymbol('AXL'),
      tokenType: TokenType.Ibc,
      denom:
        'ibc/B68C1D2682A8B69E20BB921E34C6A3A2B6D1E13E3E8C0092E373826F546DEE65',
    },
    {
      ...tokenMetaUtils.getMetaBySymbol('DOT'),
      tokenType: TokenType.Ibc,
      denom: 'dot-planck',
    },
  ],
  [CosmosChainId.Evmos]: {
    ...tokenMetaUtils.getMetaBySymbol('EVMOS'),
    tokenType: TokenType.Ibc,
    denom:
      'ibc/16618B7F7AC551F48C057A13F4CA5503693FBFF507719A85BC6876B8BD75F821',
  },
  [CosmosChainId.Persistence]: {
    ...tokenMetaUtils.getMetaBySymbol('XPRT'),
    tokenType: TokenType.Ibc,
    denom:
      'ibc/B786E7CBBF026F6F15A8DA248E0F18C62A0F7A70CB2DABD9239398C8B5150ABB',
  },
  [CosmosChainId.Secret]: {
    ...tokenMetaUtils.getMetaBySymbol('SCRT'),
    tokenType: TokenType.Ibc,
    denom:
      'ibc/0954E1C28EB7AF5B72D24F3BC2B47BBB2FDF91BDDFD57B74B99E133AED40972A',
  },
  [CosmosChainId.Stride]: {
    ...tokenMetaUtils.getMetaBySymbol('STRD'),
    tokenType: TokenType.Ibc,
    denom:
      'ibc/3FDD002A3A4019B05A33D324B2F29748E77AF501BEA5C96D1F28B2D6755F9F25',
  },
  [CosmosChainId.Crescent]: [
    {
      ...tokenMetaUtils.getMetaBySymbol('CRE'),
      tokenType: TokenType.Ibc,
      denom:
        'ibc/3A6DD3358D9F7ADD18CDE79BA10B400511A5DE4AE2C037D7C9639B52ADAF35C6',
    },
    {
      ...tokenMetaUtils.getMetaBySymbol('INJ'),
      tokenType: TokenType.Ibc,
      denom: 'inj',
    },
  ],
  [CosmosChainId.Sommelier]: {
    ...tokenMetaUtils.getMetaBySymbol('SOMM'),
    tokenType: TokenType.Ibc,
    denom:
      'ibc/34346A60A95EB030D62D6F5BDD4B745BE18E8A693372A8A347D5D53DBBB1328B',
  },
  [TestnetCosmosChainId.Cosmoshub]: {
    ...tokenMetaUtils.getMetaBySymbol('UPHOTON'),
    tokenType: TokenType.Ibc,
    denom:
      'ibc/48BC9C6ACBDFC1EBA034F1859245D53EA4BF74147189D66F27C23BF966335DFB',
  },
  [TestnetCosmosChainId.Injective]: {
    ...tokenMetaUtils.getMetaBySymbol('INJ'),
    tokenType: TokenType.Ibc,
    denom: 'inj',
  },
  [TestnetCosmosChainId.Cosmoshub]: {
    ...tokenMetaUtils.getMetaBySymbol('UPHOTON'),
    tokenType: TokenType.Ibc,
    denom:
      'ibc/48BC9C6ACBDFC1EBA034F1859245D53EA4BF74147189D66F27C23BF966335DFB',
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

export const ibcHashToNativeInjPerCosmosChain = {
  [CosmosChainId.Osmosis]:
    'ibc/64BA6E31FE887D66C6F8F31C7B1A80C7CA179239677B4088BB55F5EA07DBE273',
  [CosmosChainId.Crescent]:
    'ibc/5A76568E079A31FA12165E4559BA9F1E9D4C97F9C2060B538C84DCD503815E30',
  [CosmosChainId.Persistence]:
    'ibc/D64E84758BCA42602C27E9ED2DB8F4EFDAE6A1E311CF404B516D45FEDF319D73',
} as Partial<Record<CosmosChainId, string>>

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
    case BridgingNetwork.CosmosHubTestnet:
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
