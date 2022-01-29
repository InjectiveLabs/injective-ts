import { Bech32Address } from '@keplr-wallet/cosmos'
import { getEndpointFromChainId } from '../endpoints'
import { TestnetCosmosChainId, CosmosChainId } from '../types'

export default {
  [TestnetCosmosChainId.Cosmoshub]: {
    ...getEndpointFromChainId(TestnetCosmosChainId.Cosmoshub),
    rpcConfig: undefined,
    restConfig: undefined,
    chainId: 'cosmoshub-testnet',
    chainName: 'Cosmos Testnet',
    stakeCurrency: {
      coinDenom: 'UPHOTON',
      coinMinimalDenom: 'uphoton',
      coinDecimals: 6,
      coinGeckoId: 'cosmos',
    },
    walletUrl: 'https://wallet.keplr.app/#/cosmoshub/stake',
    walletUrlForStaking: 'https://wallet.keplr.app/#/cosmoshub/stake',
    bip44: {
      coinType: 118,
    },
    bech32Config: Bech32Address.defaultBech32Config('cosmos'),
    currencies: [
      {
        coinDenom: 'UPHOTON',
        coinMinimalDenom: 'uphoton',
        coinDecimals: 6,
        coinGeckoId: 'cosmos',
      },
    ],
    feeCurrencies: [
      {
        coinDenom: 'UPHOTON',
        coinMinimalDenom: 'uphoton',
        coinDecimals: 6,
        coinGeckoId: 'cosmos',
      },
    ],
    coinType: 118,
    features: ['stargate', 'ibc-transfer'],
  },
  [TestnetCosmosChainId.Injective]: {
    ...getEndpointFromChainId(TestnetCosmosChainId.Injective),
    rpcConfig: undefined,
    restConfig: undefined,
    chainId: 'injective-888',
    chainName: 'Injective Testnet',
    stakeCurrency: {
      coinDenom: 'INJ',
      coinMinimalDenom: 'inj',
      coinDecimals: 18,
      coinGeckoId: 'injective-protocol',
    },
    walletUrl: 'https://hub.injective.dev/',
    walletUrlForStaking: 'https://hub.injective.dev/',
    bip44: {
      coinType: 118,
    },
    bech32Config: Bech32Address.defaultBech32Config('inj'),
    currencies: [
      {
        coinDenom: 'INJ',
        coinMinimalDenom: 'inj',
        coinDecimals: 18,
        coinGeckoId: 'injective-protocol',
      },
    ],
    feeCurrencies: [
      {
        coinDenom: 'INJ',
        coinMinimalDenom: 'inj',
        coinDecimals: 18,
        coinGeckoId: 'injective-protocol',
      },
    ],
    coinType: 118,
    features: ['stargate', 'ibc-transfer'],
  },
  [CosmosChainId.Injective]: {
    ...getEndpointFromChainId(CosmosChainId.Injective),
    rpcConfig: undefined,
    restConfig: undefined,
    chainId: 'injective-1',
    chainName: 'Injective',
    stakeCurrency: {
      coinDenom: 'INJ',
      coinMinimalDenom: 'inj',
      coinDecimals: 18,
      coinGeckoId: 'injective-protocol',
    },
    walletUrl: 'https://hub.injective.network/',
    walletUrlForStaking: 'https://hub.injective.network/',
    bip44: {
      coinType: 118,
    },
    bech32Config: Bech32Address.defaultBech32Config('inj'),
    currencies: [
      {
        coinDenom: 'INJ',
        coinMinimalDenom: 'inj',
        coinDecimals: 18,
        coinGeckoId: 'injective-protocol',
      },
    ],
    feeCurrencies: [
      {
        coinDenom: 'INJ',
        coinMinimalDenom: 'inj',
        coinDecimals: 18,
        coinGeckoId: 'injective-protocol',
      },
    ],
    coinType: 118,
    features: ['stargate', 'ibc-transfer'],
  },
  [CosmosChainId.Terra]: {
    ...getEndpointFromChainId(CosmosChainId.Terra),
    rpcConfig: undefined,
    restConfig: undefined,
    chainId: 'columbus-5',
    chainName: 'Terra',
    stakeCurrency: {
      coinDenom: 'LUNA',
      coinMinimalDenom: 'uluna',
      coinDecimals: 6,
      coinGeckoId: 'terra-luna',
    },
    walletUrl: 'https://station.terra.money/wallet',
    walletUrlForStaking: 'https://station.terra.money/wallet',
    bip44: {
      coinType: 118,
    },
    bech32Config: Bech32Address.defaultBech32Config('terra'),
    currencies: [
      {
        coinDenom: 'LUNA',
        coinMinimalDenom: 'uluna',
        coinDecimals: 6,
        coinGeckoId: 'terra-luna',
      },
      {
        coinDenom: 'UST',
        coinMinimalDenom: 'uusd',
        coinGeckoId: 'terrausd',
        coinDecimals: 6,
      },
    ],
    feeCurrencies: [
      {
        coinDenom: 'LUNA',
        coinMinimalDenom: 'uluna',
        coinGeckoId: 'terra-luna',
        coinDecimals: 6,
      },
      {
        coinDenom: 'UST',
        coinMinimalDenom: 'uusd',
        coinGeckoId: 'terrausd',
        coinDecimals: 6,
      },
    ],
    coinType: 118,
    gasPriceStep: {
      low: 0.01,
      average: 0.3,
      high: 0.04,
    },
    features: ['ibc-transfer'],
  },
  [CosmosChainId.Chihuahua]: {
    ...getEndpointFromChainId(CosmosChainId.Chihuahua),
    chainId: 'chihuahua-1',
    chainName: 'Chihuahua',
    stakeCurrency: {
      coinDenom: 'HUAHUA',
      coinMinimalDenom: 'uhuahua',
      coinDecimals: 6,
    },
    bip44: {
      coinType: 118,
    },
    bech32Config: Bech32Address.defaultBech32Config('chihuahua'),
    currencies: [
      {
        coinDenom: 'HUAHUA',
        coinMinimalDenom: 'uhuahua',
        coinDecimals: 6,
      },
    ],
    feeCurrencies: [
      {
        coinDenom: 'HUAHUA',
        coinMinimalDenom: 'uhuahua',
        coinDecimals: 6,
      },
    ],
    gasPriceStep: {
      low: 0.025,
      average: 0.03,
      high: 0.035,
    },
    features: ['stargate', 'ibc-transfer', 'no-legacy-stdTx', 'ibc-go'],
  },
} as Record<string, any>
