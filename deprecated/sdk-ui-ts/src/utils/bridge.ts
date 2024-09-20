import {
  NetworkConfig,
  BridgingNetwork,
  BridgeTransactionState,
} from './../types/bridge'
import {
  Network,
  isDevnet,
  isTestnet,
  isMainnet,
} from '@injectivelabs/networks'
import { UiBridgeTransaction, MintScanExplorerUrl } from './../types/bridge'
import {
  PEGGY_GRAPH_URL,
  PEGGY_DEVNET_GRAPH_URL,
  PEGGY_DEVNET1_GRAPH_URL,
  PEGGY_DEVNET2_GRAPH_URL,
  PEGGY_TESTNET_GRAPH_URL,
} from '../constants'
import { CosmosChainId, TestnetCosmosChainId } from '@injectivelabs/ts-types'
import {
  Token,
  TokenType,
  TokenMetaBase,
  tokenMetaUtils,
  getTokenFromMeta,
} from '@injectivelabs/token-metadata'
import { TokenMetadataResponse } from 'alchemy-sdk'

export const InProgressStates = [
  BridgeTransactionState.Confirming,
  BridgeTransactionState.Submitted,
  BridgeTransactionState.InjectiveConfirming,
  BridgeTransactionState.EthereumConfirming,
  BridgeTransactionState.RequestingVAA,
  BridgeTransactionState.Redeemable,
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
  BridgingNetwork.Kava,
  BridgingNetwork.Oraichain,
  BridgingNetwork.Noble,
  BridgingNetwork.Celestia,
  BridgingNetwork.Migaloo,
  BridgingNetwork.Kujira,
  BridgingNetwork.Andromeda,
  BridgingNetwork.Neutron,
]

export const LeapNetworks = [
  BridgingNetwork.CosmosHub,
  BridgingNetwork.Osmosis,
  BridgingNetwork.Axelar,
  BridgingNetwork.Juno,
  BridgingNetwork.Persistence,
  BridgingNetwork.Stride,
  BridgingNetwork.Sommelier,
  BridgingNetwork.Canto,
  BridgingNetwork.Kava,
  BridgingNetwork.Noble,
  BridgingNetwork.Celestia,
  BridgingNetwork.Migaloo,
  BridgingNetwork.Kujira,
  BridgingNetwork.Neutron,
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
  BridgingNetwork.Canto,
  BridgingNetwork.Kava,
  BridgingNetwork.Noble,
  BridgingNetwork.Celestia,
  BridgingNetwork.Migaloo,
  BridgingNetwork.Neutron,
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
  BridgingNetwork.Canto,
  BridgingNetwork.Kava,
  BridgingNetwork.Oraichain,
  BridgingNetwork.Noble,
  BridgingNetwork.Celestia,
  BridgingNetwork.Migaloo,
  BridgingNetwork.Kujira,
  BridgingNetwork.Andromeda,
  BridgingNetwork.Neutron,
]

export const EvmWormholeNetworks = [
  BridgingNetwork.EthereumWh,
  BridgingNetwork.Polygon,
  BridgingNetwork.Arbitrum,
  BridgingNetwork.Klaytn,
]

export const tokenSelectorDisabledNetworks = [
  BridgingNetwork.Juno,
  BridgingNetwork.Moonbeam,
  BridgingNetwork.Chihuahua,
  BridgingNetwork.CosmosHub,
  BridgingNetwork.Persistence,
  BridgingNetwork.CosmosHubTestnet,
  BridgingNetwork.Arbitrum,
  BridgingNetwork.Polygon,
  BridgingNetwork.Sui,
  BridgingNetwork.Klaytn,
  BridgingNetwork.Migaloo,
]

export const tokenDenomsPerNetwork: NetworkConfig[] = [
  {
    network: BridgingNetwork.CosmosHub,
    denoms: [
      'ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9',
    ],
  },
  {
    network: BridgingNetwork.Osmosis,
    denoms: [
      'inj',
      'ibc/92E0120F15D037353CFB73C14651FC8930ADC05B93100FD7754D3A689E53B333',
    ],
  },
  {
    network: BridgingNetwork.Chihuahua,
    denoms: [
      'ibc/E7807A46C0B7B44B350DA58F51F278881B863EC4DCA94635DAB39E52C30766CB',
    ],
  },
  {
    network: BridgingNetwork.Axelar,
    denoms: [
      'dot-planck',
      'ibc/B68C1D2682A8B69E20BB921E34C6A3A2B6D1E13E3E8C0092E373826F546DEE65',
    ],
  },
  {
    network: BridgingNetwork.Juno,
    denoms: [
      'ibc/D50E26996253EBAA8C684B9CD653FE2F7665D7BDDCA3D48D5E1378CF6334F211',
    ],
  },
  {
    network: BridgingNetwork.Terra,
    denoms: [
      'ibc/B8AF5D92165F35AB31F3FC7C7B444B9D240760FA5D406C49D24862BD0284E395',
      'ibc/B448C0CA358B958301D328CCDC5D5AD642FC30A6D3AE106FF721DB315F3DDE5C',
    ],
  },
  {
    network: BridgingNetwork.Evmos,
    denoms: [
      'ibc/16618B7F7AC551F48C057A13F4CA5503693FBFF507719A85BC6876B8BD75F821',
      'ibc/F6CC233E5C0EA36B1F74AB1AF98471A2D6A80E2542856639703E908B4D93E7C4',
    ],
  },
  {
    network: BridgingNetwork.Persistence,
    denoms: [
      'inj',
      'ibc/B786E7CBBF026F6F15A8DA248E0F18C62A0F7A70CB2DABD9239398C8B5150ABB',
    ],
  },
  {
    network: BridgingNetwork.Secret,
    denoms: [
      'ibc/0954E1C28EB7AF5B72D24F3BC2B47BBB2FDF91BDDFD57B74B99E133AED40972A',
    ],
  },
  {
    network: BridgingNetwork.Stride,
    denoms: [
      'inj',
      'ibc/3FDD002A3A4019B05A33D324B2F29748E77AF501BEA5C96D1F28B2D6755F9F25',
      'ibc/AC87717EA002B0123B10A05063E69BCA274BA2C44D842AEEB41558D2856DCE93',
    ],
  },
  {
    network: BridgingNetwork.Crescent,
    denoms: [
      'inj',
      'ibc/3A6DD3358D9F7ADD18CDE79BA10B400511A5DE4AE2C037D7C9639B52ADAF35C6',
    ],
  },
  {
    network: BridgingNetwork.Sommelier,
    denoms: [
      'ibc/34346A60A95EB030D62D6F5BDD4B745BE18E8A693372A8A347D5D53DBBB1328B',
    ],
  },
  {
    network: BridgingNetwork.Canto,
    denoms: [
      'ibc/D91A2C4EE7CD86BBAFCE0FA44A60DDD9AFBB7EEB5B2D46C0984DEBCC6FEDFAE8',
    ],
  },
  {
    network: BridgingNetwork.Kava,
    denoms: [
      'ibc/57AA1A70A4BC9769C525EBF6386F7A21536E04A79D62E1981EFCEF9428EBB205',
      'ibc/4ABBEF4C8926DDDB320AE5188CFD63267ABBCEFC0583E4AE05D6E5AA2401DDAB',
    ],
  },
  {
    network: BridgingNetwork.Oraichain,
    denoms: [
      'ibc/C20C0A822BD22B2CEF0D067400FCCFB6FAEEE9E91D360B4E0725BD522302D565',
    ],
  },
  {
    network: BridgingNetwork.CosmosHubTestnet,
    denoms: [
      'ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9',
    ],
  },
  {
    network: BridgingNetwork.Solana,
    denoms: [
      'factory/inj14ejqjyq8um4p3xfqj74yld5waqljf88f9eneuk/inj1sthrn5ep8ls5vzz8f9gp89khhmedahhdkqa8z3',
      'factory/inj14ejqjyq8um4p3xfqj74yld5waqljf88f9eneuk/inj1tjcf9497fwmrnk22jfu5hsdq82qshga54ajvzy',
      'ibc/A8B0B746B5AB736C2D8577259B510D56B8AF598008F68041E3D634BCDE72BE97',
      'ibc/F3330C1B8BD1886FE9509B94C7B5398B892EA41420D2BC0B7C6A53CB8ED761D6',
    ],
  },
  {
    network: BridgingNetwork.EthereumWh,
    denoms: [
      'factory/inj14ejqjyq8um4p3xfqj74yld5waqljf88f9eneuk/inj1q6zlut7gtkzknkk773jecujwsdkgq882akqksk',
      'factory/inj14ejqjyq8um4p3xfqj74yld5waqljf88f9eneuk/inj1q6kpxy6ar5lkxqudjvryarrrttmakwsvzkvcyh',
      'factory/inj14ejqjyq8um4p3xfqj74yld5waqljf88f9eneuk/inj1me6t602jlndzxgv2d7ekcnkjuqdp7vfh4txpyy',
      'factory/inj14ejqjyq8um4p3xfqj74yld5waqljf88f9eneuk/inj14jesa4q248mfxztfc9zgpswkpa4wx249mya9kk',
      'factory/inj14ejqjyq8um4p3xfqj74yld5waqljf88f9eneuk/inj1zwnsemwrpve3wrrg0njj89w6mt5rmj9ydkc46u',
    ],
  },
  {
    network: BridgingNetwork.Arbitrum,
    denoms: [
      'factory/inj14ejqjyq8um4p3xfqj74yld5waqljf88f9eneuk/inj1d5vz0uzwlpfvgwrwulxg6syy82axa58y4fuszd',
    ],
  },
  {
    network: BridgingNetwork.Polygon,
    denoms: [
      'factory/inj14ejqjyq8um4p3xfqj74yld5waqljf88f9eneuk/inj1dxv423h8ygzgxmxnvrf33ws3k94aedfdevxd8h',
    ],
  },

  {
    network: BridgingNetwork.Noble,
    denoms: [
      'ibc/2CBC2EA121AE42563B08028466F37B600F2D7D4282342DE938283CC3FB2BC00E',
    ],
  },
  {
    network: BridgingNetwork.Celestia,
    denoms: [
      'ibc/F51BB221BAA275F2EBF654F70B005627D7E713AFFD6D86AFD1E43CAA886149F4',
    ],
  },
  {
    network: BridgingNetwork.Migaloo,
    denoms: [
      'inj',
      'ibc/D6E6A20ABDD600742D22464340A7701558027759CE14D12590F8EA869CCCF445',
    ],
  },
  {
    network: BridgingNetwork.Kujira,
    denoms: [
      'ibc/9A115B56E769B92621FFF90567E2D60EFD146E86E867491DB69EEDA9ADC36204',
    ],
  },
  {
    network: BridgingNetwork.Andromeda,
    denoms: [
      'ibc/61FA42C3F0B0F8768ED2CE380EDD3BE0E4CB7E67688F81F70DE9ECF5F8684E1E',
    ],
  },
  {
    network: BridgingNetwork.Neutron,
    denoms: [
      'ibc/1011E4D6D4800DA9B8F21D7C207C0B0C18E54E614A8576037F066B775210709D',
    ],
  },
]

export const cosmosChainTokenMetaMap = {
  [CosmosChainId.Cosmoshub]: {
    ...getTokenFromMeta(
      tokenMetaUtils.getMetaBySymbol('ATOM') as TokenMetaBase,
    ),
    denom:
      'ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9',
  },
  [CosmosChainId.Osmosis]: [
    {
      ...getTokenFromMeta(
        tokenMetaUtils.getMetaBySymbol('OSMO') as TokenMetaBase,
      ),
      denom:
        'ibc/92E0120F15D037353CFB73C14651FC8930ADC05B93100FD7754D3A689E53B333',
    },
    {
      ...getTokenFromMeta(
        tokenMetaUtils.getMetaBySymbol('INJ') as TokenMetaBase,
      ),
      denom: 'inj',
    },
  ],
  [CosmosChainId.Terra]: [
    {
      ...getTokenFromMeta(
        tokenMetaUtils.getMetaBySymbol('LUNA') as TokenMetaBase,
      ),
      denom:
        'ibc/B8AF5D92165F35AB31F3FC7C7B444B9D240760FA5D406C49D24862BD0284E395',
    },
    {
      ...getTokenFromMeta(
        tokenMetaUtils.getMetaBySymbol('UST') as TokenMetaBase,
      ),
      denom:
        'ibc/B448C0CA358B958301D328CCDC5D5AD642FC30A6D3AE106FF721DB315F3DDE5C',
    },
  ],
  [CosmosChainId.Injective]: {
    ...getTokenFromMeta(tokenMetaUtils.getMetaBySymbol('INJ') as TokenMetaBase),
    denom: 'inj',
  },
  [CosmosChainId.Chihuahua]: {
    ...getTokenFromMeta(
      tokenMetaUtils.getMetaBySymbol('HUAHUA') as TokenMetaBase,
    ),
    denom:
      'ibc/E7807A46C0B7B44B350DA58F51F278881B863EC4DCA94635DAB39E52C30766CB',
  },
  [CosmosChainId.Juno]: {
    ...getTokenFromMeta(
      tokenMetaUtils.getMetaBySymbol('JUNO') as TokenMetaBase,
    ),
    denom:
      'ibc/D50E26996253EBAA8C684B9CD653FE2F7665D7BDDCA3D48D5E1378CF6334F211',
  },
  [CosmosChainId.Axelar]: [
    {
      ...getTokenFromMeta(
        tokenMetaUtils.getMetaBySymbol('AXL') as TokenMetaBase,
      ),
      denom:
        'ibc/B68C1D2682A8B69E20BB921E34C6A3A2B6D1E13E3E8C0092E373826F546DEE65',
    },
    {
      ...getTokenFromMeta(
        tokenMetaUtils.getMetaBySymbol('DOT') as TokenMetaBase,
      ),
      denom: 'dot-planck',
    },
  ],
  [CosmosChainId.Evmos]: [
    {
      ...getTokenFromMeta(
        tokenMetaUtils.getMetaBySymbol('EVMOS') as TokenMetaBase,
      ),
      denom:
        'ibc/16618B7F7AC551F48C057A13F4CA5503693FBFF507719A85BC6876B8BD75F821',
    },
    {
      ...getTokenFromMeta(
        tokenMetaUtils.getMetaBySymbol('NEOK') as TokenMetaBase,
      ),
      denom:
        'ibc/F6CC233E5C0EA36B1F74AB1AF98471A2D6A80E2542856639703E908B4D93E7C4',
    },
  ],
  [CosmosChainId.Persistence]: {
    ...getTokenFromMeta(
      tokenMetaUtils.getMetaBySymbol('XPRT') as TokenMetaBase,
    ),
    denom:
      'ibc/B786E7CBBF026F6F15A8DA248E0F18C62A0F7A70CB2DABD9239398C8B5150ABB',
  },
  [CosmosChainId.Secret]: {
    ...getTokenFromMeta(
      tokenMetaUtils.getMetaBySymbol('SCRT') as TokenMetaBase,
    ),
    denom:
      'ibc/0954E1C28EB7AF5B72D24F3BC2B47BBB2FDF91BDDFD57B74B99E133AED40972A',
  },
  [CosmosChainId.Stride]: [
    {
      ...getTokenFromMeta(
        tokenMetaUtils.getMetaBySymbol('STRD') as TokenMetaBase,
      ),
      denom:
        'ibc/3FDD002A3A4019B05A33D324B2F29748E77AF501BEA5C96D1F28B2D6755F9F25',
    },
    {
      ...getTokenFromMeta(
        tokenMetaUtils.getMetaBySymbol('INJ') as TokenMetaBase,
      ),
      denom: 'inj',
    },
    {
      ...getTokenFromMeta(
        tokenMetaUtils.getMetaBySymbol('STINJ') as TokenMetaBase,
      ),
      denom:
        'ibc/AC87717EA002B0123B10A05063E69BCA274BA2C44D842AEEB41558D2856DCE93',
    },
  ],
  [CosmosChainId.Crescent]: [
    {
      ...getTokenFromMeta(
        tokenMetaUtils.getMetaBySymbol('CRE') as TokenMetaBase,
      ),
      denom:
        'ibc/3A6DD3358D9F7ADD18CDE79BA10B400511A5DE4AE2C037D7C9639B52ADAF35C6',
    },
    {
      ...getTokenFromMeta(
        tokenMetaUtils.getMetaBySymbol('INJ') as TokenMetaBase,
      ),
      denom: 'inj',
    },
  ],
  [CosmosChainId.Sommelier]: {
    ...getTokenFromMeta(
      tokenMetaUtils.getMetaBySymbol('SOMM') as TokenMetaBase,
    ),
    denom:
      'ibc/34346A60A95EB030D62D6F5BDD4B745BE18E8A693372A8A347D5D53DBBB1328B',
  },
  [CosmosChainId.Canto]: {
    ...getTokenFromMeta(
      tokenMetaUtils.getMetaBySymbol('CANTO') as TokenMetaBase,
    ),
    denom:
      'ibc/D91A2C4EE7CD86BBAFCE0FA44A60DDD9AFBB7EEB5B2D46C0984DEBCC6FEDFAE8',
  },
  [CosmosChainId.Kava]: [
    {
      ...getTokenFromMeta(
        tokenMetaUtils.getMetaBySymbol('KAVA') as TokenMetaBase,
      ),
      denom:
        'ibc/57AA1A70A4BC9769C525EBF6386F7A21536E04A79D62E1981EFCEF9428EBB205',
    },
    {
      ...getTokenFromMeta(
        tokenMetaUtils.getMetaBySymbol('USDTkv') as TokenMetaBase,
      ),
      denom:
        'ibc/4ABBEF4C8926DDDB320AE5188CFD63267ABBCEFC0583E4AE05D6E5AA2401DDAB',
    },
  ],
  [CosmosChainId.Oraichain]: [
    {
      ...getTokenFromMeta(
        tokenMetaUtils.getMetaBySymbol('ORAI') as TokenMetaBase,
      ),
      denom:
        'ibc/C20C0A822BD22B2CEF0D067400FCCFB6FAEEE9E91D360B4E0725BD522302D565',
    },
  ],
  [TestnetCosmosChainId.Cosmoshub]: {
    ...getTokenFromMeta(
      tokenMetaUtils.getMetaBySymbol('ATOM') as TokenMetaBase,
    ),
    // TODO: change when IBC connection established
    denom:
      'ibc/48BC9C6ACBDFC1EBA034F1859245D53EA4BF74147189D66F27C23BF966335DFB',
  },
  [TestnetCosmosChainId.Injective]: {
    ...getTokenFromMeta(tokenMetaUtils.getMetaBySymbol('INJ') as TokenMetaBase),
    denom: 'inj',
  },
  [CosmosChainId.Noble]: {
    ...getTokenFromMeta(
      tokenMetaUtils.getMetaBySymbol('USDC') as TokenMetaBase,
    ),
    denom:
      'ibc/2CBC2EA121AE42563B08028466F37B600F2D7D4282342DE938283CC3FB2BC00E',
  },
  [CosmosChainId.Celestia]: {
    ...getTokenFromMeta(tokenMetaUtils.getMetaBySymbol('TIA') as TokenMetaBase),
    denom:
      'ibc/F51BB221BAA275F2EBF654F70B005627D7E713AFFD6D86AFD1E43CAA886149F4',
  },
  [CosmosChainId.Migaloo]: [
    {
      ...getTokenFromMeta(
        tokenMetaUtils.getMetaBySymbol('WHALE') as TokenMetaBase,
      ),
      denom:
        'ibc/D6E6A20ABDD600742D22464340A7701558027759CE14D12590F8EA869CCCF445',
    },
  ],
  [CosmosChainId.Kujira]: {
    ...getTokenFromMeta(
      tokenMetaUtils.getMetaBySymbol('KUJI') as TokenMetaBase,
    ),
    denom:
      'ibc/9A115B56E769B92621FFF90567E2D60EFD146E86E867491DB69EEDA9ADC36204',
  },
  [CosmosChainId.Andromeda]: {
    ...getTokenFromMeta(
      tokenMetaUtils.getMetaBySymbol('ANDR') as TokenMetaBase,
    ),
    denom:
      'ibc/61FA42C3F0B0F8768ED2CE380EDD3BE0E4CB7E67688F81F70DE9ECF5F8684E1E',
  },
  [CosmosChainId.Neutron]: {
    ...getTokenFromMeta(
      tokenMetaUtils.getMetaBySymbol('NBZ') as TokenMetaBase,
    ),
    denom:
      'ibc/1011E4D6D4800DA9B8F21D7C207C0B0C18E54E614A8576037F066B775210709D',
  },
} as Record<string, Token | Token[]>

export const ibcHashToNativeInjPerNetwork = {
  [BridgingNetwork.Osmosis]:
    'ibc/64BA6E31FE887D66C6F8F31C7B1A80C7CA179239677B4088BB55F5EA07DBE273',
  [BridgingNetwork.Crescent]:
    'ibc/5A76568E079A31FA12165E4559BA9F1E9D4C97F9C2060B538C84DCD503815E30',
  [BridgingNetwork.Persistence]:
    'ibc/D64E84758BCA42602C27E9ED2DB8F4EFDAE6A1E311CF404B516D45FEDF319D73',
  [BridgingNetwork.Stride]:
    'ibc/A7454562FF29FE068F42F9DE4805ABEF54F599D1720B345D6518D9B5C64EA6D2',
  [BridgingNetwork.Migaloo]:
    'ibc/1C2D8505A29823310B4484E4C63CFDCB08C0D3B57537A615A45F4E5D42CDC789',
} as Partial<Record<BridgingNetwork, string>>

export const ibcHashToNativeInjPerCosmosChain = {
  [CosmosChainId.Osmosis]:
    'ibc/64BA6E31FE887D66C6F8F31C7B1A80C7CA179239677B4088BB55F5EA07DBE273',
  [CosmosChainId.Crescent]:
    'ibc/5A76568E079A31FA12165E4559BA9F1E9D4C97F9C2060B538C84DCD503815E30',
  [CosmosChainId.Persistence]:
    'ibc/D64E84758BCA42602C27E9ED2DB8F4EFDAE6A1E311CF404B516D45FEDF319D73',
  [CosmosChainId.Stride]:
    'ibc/A7454562FF29FE068F42F9DE4805ABEF54F599D1720B345D6518D9B5C64EA6D2',
  [BridgingNetwork.Migaloo]:
    'ibc/1C2D8505A29823310B4484E4C63CFDCB08C0D3B57537A615A45F4E5D42CDC789',
} as Partial<Record<CosmosChainId, string>>

export const getExplorerUrl = (network: Network): string => {
  if (isDevnet(network)) {
    return 'https://devnet.explorer.injective.dev'
  }

  if (isTestnet(network)) {
    return 'https://testnet.explorer.injective.network'
  }

  return 'https://explorer.injective.network'
}

export const getCosmosExplorerUrl = (
  bridgingNetwork: BridgingNetwork = BridgingNetwork.CosmosHub,
  network: Network,
): string => {
  if (bridgingNetwork === BridgingNetwork.Oraichain) {
    return 'https://scan.orai.io'
  }

  if (bridgingNetwork === BridgingNetwork.Migaloo) {
    return 'https://migaloo.explorers.guru'
  }

  if (bridgingNetwork === BridgingNetwork.Andromeda) {
    return 'https://ping.wildsage.io/andromeda'
  }

  const mintScanNetworkUrl = MintScanExplorerUrl[bridgingNetwork]

  if (isDevnet(network)) {
    return `https://dev.mintscan.io/${mintScanNetworkUrl}-testnet`
  }

  if (isTestnet(network)) {
    return `https://testnet.mintscan.io/${mintScanNetworkUrl}-testnet`
  }

  return `https://www.mintscan.io/${mintScanNetworkUrl}`
}

export const getEthereumExplorerUrl = (network: Network): string => {
  if (isDevnet(network)) {
    return 'https://sepolia.etherscan.io'
  }

  if (isTestnet(network)) {
    return 'https://sepolia.etherscan.io'
  }

  return 'https://etherscan.io'
}

export const getArbitrumExplorerUrl = (network: Network): string => {
  if (isDevnet(network)) {
    return 'https://sepolia.arbiscan.io'
  }

  if (isTestnet(network)) {
    return 'https://sepolia.arbiscan.io'
  }

  return 'https://arbiscan.io'
}

export const getPolygonExplorerUrl = (network: Network): string => {
  if (isDevnet(network)) {
    return 'https://mumbai.polygonscan.com'
  }

  if (isTestnet(network)) {
    return 'https://mumbai.polygonscan.com'
  }

  return 'https://polygonscan.com'
}

export const getSolanaExplorerUrl = (network: Network): string => {
  if (isDevnet(network)) {
    return 'https://explorer.solana.com/?cluster=devnet'
  }

  if (isTestnet(network)) {
    return 'https://explorer.solana.com/?cluster=testnet'
  }

  return 'https://explorer.solana.com/'
}

export const getTerraExplorerUrl = (network: Network): string => {
  if (isDevnet(network)) {
    return 'https://finder.terra.money/localterra'
  }

  if (isTestnet(network)) {
    return 'https://finder.terra.money/testnet/'
  }

  return 'https://finder.terra.money/mainnet'
}

export const getPeggoGraphQlEndpoint = (network: Network): string => {
  if (isMainnet(network)) {
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

export const getNetworkFromAddress = (address: string): BridgingNetwork => {
  if (address.startsWith('inj')) {
    return BridgingNetwork.Injective
  }

  if (address.startsWith('cosmos')) {
    return BridgingNetwork.CosmosHub
  }

  if (address.startsWith('juno')) {
    return BridgingNetwork.Juno
  }

  if (address.startsWith('terra')) {
    return BridgingNetwork.Terra
  }

  if (address.startsWith('osmo')) {
    return BridgingNetwork.Osmosis
  }

  if (address.startsWith('chihuahua')) {
    return BridgingNetwork.Chihuahua
  }

  if (address.startsWith('axelar')) {
    return BridgingNetwork.Axelar
  }

  if (address.startsWith('evmos')) {
    return BridgingNetwork.Evmos
  }

  if (address.startsWith('persistence')) {
    return BridgingNetwork.Persistence
  }

  if (address.startsWith('secret')) {
    return BridgingNetwork.Secret
  }

  if (address.startsWith('stride')) {
    return BridgingNetwork.Stride
  }

  if (address.startsWith('cre')) {
    return BridgingNetwork.Crescent
  }

  if (address.startsWith('somm')) {
    return BridgingNetwork.Sommelier
  }

  if (address.startsWith('canto')) {
    return BridgingNetwork.Canto
  }

  if (address.startsWith('kava')) {
    return BridgingNetwork.Kava
  }

  if (address.startsWith('orai')) {
    return BridgingNetwork.Oraichain
  }

  if (address.startsWith('0x')) {
    return BridgingNetwork.Ethereum
  }

  if (address.startsWith('noble')) {
    return BridgingNetwork.Noble
  }

  if (address.startsWith('celestia')) {
    return BridgingNetwork.Celestia
  }

  if (address.startsWith('migaloo')) {
    return BridgingNetwork.Migaloo
  }

  if (address.startsWith('kujira')) {
    return BridgingNetwork.Kujira
  }

  if (address.startsWith('andr')) {
    return BridgingNetwork.Andromeda
  }

  if (address.startsWith('neutron')) {
    return BridgingNetwork.Neutron
  }

  return BridgingNetwork.Injective
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
    case CosmosChainId.Kava:
      return 0.01
    case CosmosChainId.Neutron:
        return 0.01
    case CosmosChainId.Injective:
      return 0.01
    default:
      return 0.01
  }
}

export const formatWeb3Token = ({
  transaction,
  tokenFromWeb3,
}: {
  transaction: UiBridgeTransaction
  tokenFromWeb3: TokenMetadataResponse
}) => {
  const decimals = tokenFromWeb3.decimals || 18
  const token = {
    decimals,
    denom: `peggy${transaction.denom}`,
    name: tokenFromWeb3.name || '',
    logo: tokenFromWeb3.logo || '',
    symbol: tokenFromWeb3.symbol || '',
    tokenType: TokenType.Erc20,
    coinGeckoId: '',

    erc20: {
      decimals,
      address: transaction.denom,
      tokenType: TokenType.Erc20,
    },
  }

  return token
}
