import { Bech32Address } from '@keplr-wallet/cosmos'
import { getLcdEndpointFromChainId } from '../endpoints'
import { TestnetCosmosChainId, CosmosChainId } from '../types'

export default {
  [TestnetCosmosChainId.Cosmoshub]: {
    ...getLcdEndpointFromChainId(TestnetCosmosChainId.Cosmoshub),
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
    ...getLcdEndpointFromChainId(TestnetCosmosChainId.Injective),
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
    ...getLcdEndpointFromChainId(CosmosChainId.Injective),
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
} as Record<string, any>
