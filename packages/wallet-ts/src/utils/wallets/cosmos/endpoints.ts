import {
  ChainId,
  CosmosChainId,
  TestnetCosmosChainId,
  DevnetCosmosChainId,
} from '@injectivelabs/ts-types'
import { GeneralException } from '@injectivelabs/exceptions'

export const getEndpointsFromChainId = (
  chainId: TestnetCosmosChainId | CosmosChainId | ChainId | DevnetCosmosChainId,
): { rpc: string; rest: string } => {
  switch (chainId) {
    case CosmosChainId.Injective:
      return {
        rpc: 'https://tm.injective.network',
        rest: 'https://lcd.injective.network',
      }
    case TestnetCosmosChainId.Injective:
      return {
        rpc: 'https://testnet.tm.injective.network',
        rest: 'https://testnet.lcd.injective.network',
      }
    case DevnetCosmosChainId.Injective:
      return {
        rpc: 'https://devnet.tm.injective.dev',
        rest: 'https://devnet.lcd.injective.dev',
      }
    case CosmosChainId.Cosmoshub:
      return {
        rpc: 'https://rpc.cosmos.directory/cosmoshub',
        rest: 'https://rest.cosmos.directory/cosmoshub',
      }
    case CosmosChainId.Osmosis:
      return {
        rpc: 'https://rpc.cosmos.directory/osmosis',
        rest: 'https://rest.cosmos.directory/osmosis',
      }
    case CosmosChainId.Juno:
      return {
        rpc: 'https://rpc.cosmos.directory/juno',
        rest: 'https://rest.cosmos.directory/juno',
      }
    case CosmosChainId.Terra:
      return {
        rpc: 'https://rpc.cosmos.directory/terra',
        rest: 'https://rest.cosmos.directory/terra',
      }
    case CosmosChainId.TerraUST:
      return {
        rpc: 'https://rpc.cosmos.directory/terra',
        rest: 'https://rest.cosmos.directory/terra',
      }
    case CosmosChainId.Axelar:
      return {
        rpc: 'https://rpc.cosmos.directory/axelar',
        rest: 'https://rest.cosmos.directory/axelar',
      }
    case CosmosChainId.Evmos:
      return {
        rpc: 'https://rpc.cosmos.directory/evmos',
        rest: 'https://rest.cosmos.directory/evmos',
      }
    case CosmosChainId.Persistence:
      return {
        rpc: 'https://rpc.cosmos.directory/persistence',
        rest: 'https://rest.cosmos.directory/persistence',
      }
    case CosmosChainId.Secret:
      return {
        rpc: 'https://rpc.cosmos.directory/secretnetwork',
        rest: 'https://rest.cosmos.directory/secretnetwork',
      }
    case CosmosChainId.Stride:
      return {
        rpc: 'https://rpc.cosmos.directory/stride',
        rest: 'https://rest.cosmos.directory/stride',
      }
    case CosmosChainId.Chihuahua:
      return {
        rpc: 'https://rpc.chihuahua.wtf',
        rest: 'https://api.chihuahua.wtf',
      }
    case CosmosChainId.Crescent:
      return {
        rpc: 'https://rpc.cosmos.directory/crescent',
        rest: 'https://rest.cosmos.directory/crescent',
      }
    case CosmosChainId.Sommelier:
      return {
        rpc: 'https://rpc.cosmos.directory/sommelier',
        rest: 'https://rest.cosmos.directory/sommelier',
      }
    case CosmosChainId.Canto:
      return {
        rpc: 'https://rpc.cosmos.directory/canto',
        rest: 'https://rest.cosmos.directory/canto',
      }
    case CosmosChainId.Kava:
      return {
        rpc: 'https://rpc.cosmos.directory/kava',
        rest: 'https://rest.cosmos.directory/kava',
      }
    case TestnetCosmosChainId.Cosmoshub:
      return {
        rpc: 'https://testnet.tm.cosmos.injective.dev',
        rest: 'https://testnet.lcd.cosmos.injective.dev',
      }
    default:
      throw new GeneralException(
        new Error(`Endpoints for ${chainId} not found`),
      )
  }
}
