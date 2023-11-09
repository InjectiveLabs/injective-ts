import { Bech32Address } from '@keplr-wallet/cosmos'
import { DevnetCosmosChainId } from '@injectivelabs/ts-types'
import { getEndpointsFromChainId } from '../../cosmos/endpoints'

export const experimentalChainsConfig = {
  [DevnetCosmosChainId.Injective]: {
    ...getEndpointsFromChainId(DevnetCosmosChainId.Injective),
    rpcConfig: undefined,
    restConfig: undefined,
    chainId: 'injective-777',
    chainName: 'Injective - Devnet',
    stakeCurrency: {
      coinDenom: 'INJ',
      coinMinimalDenom: 'inj',
      coinDecimals: 18,
      coinGeckoId: 'injective-protocol',
    },
    walletUrl: 'https://hub.injective.dev/',
    walletUrlForStaking: 'https://hub.injective.dev/',
    bip44: {
      coinType: 60,
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
        gasPriceStep: {
          low: 5000000000,
          average: 25000000000,
          high: 40000000000,
        },
      },
    ],
    coinType: 60,
    features: ['ibc-transfer', 'ibc-go', 'eth-address-gen', 'eth-key-sign'],
  },
} as Record<string, any>

export const getExperimentalChainConfigBasedOnChainId = (
  chainId: string,
): any | undefined => experimentalChainsConfig[chainId]
