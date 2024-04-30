import {
  ChainId,
  CosmosChainId,
  TestnetCosmosChainId,
  DevnetCosmosChainId,
} from '@injectivelabs/ts-types'
import { GeneralException } from '@injectivelabs/exceptions'

/** @deprecated - pass endpoints directly to the methods */
export const getEndpointsFromChainId = (
  chainId: TestnetCosmosChainId | CosmosChainId | ChainId | DevnetCosmosChainId,
): { rpc: string; rest: string } => {
  switch (chainId) {
    case CosmosChainId.Injective:
      return {
        rpc: 'https://sentry.tm.injective.network',
        rest: 'https://sentry.lcd.injective.network',
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
    case CosmosChainId.Oraichain:
      return {
        rpc: 'https://rpc.cosmos.directory/oraichain',
        rest: 'https://rest.cosmos.directory/oraichain',
      }
    case TestnetCosmosChainId.Cosmoshub:
      return {
        rpc: 'https://rpc.sentry-01.theta-testnet.polypore.xyz',
        rest: 'https://rest.sentry-01.theta-testnet.polypore.xyz',
      }
    case CosmosChainId.Noble:
      return {
        rpc: 'https://rpc.cosmos.directory/noble',
        rest: 'https://rest.cosmos.directory/noble',
      }
    case CosmosChainId.Celestia:
      return {
        rpc: 'https://rpc.cosmos.directory/celestia',
        rest: 'https://rest.cosmos.directory/celestia',
      }
    case CosmosChainId.Migaloo:
      return {
        rpc: 'https://rpc.cosmos.directory/migaloo',
        rest: 'https://rest.cosmos.directory/migaloo',
      }
    case CosmosChainId.Kujira:
      return {
        rpc: 'https://rpc.cosmos.directory/kujira',
        rest: 'https://rest.cosmos.directory/kujira',
      }
    case CosmosChainId.Wormchain:
      return {
        rpc: 'https://rpc.cosmos.directory/gateway',
        rest: 'https://rest.cosmos.directory/gateway',
      }
    case CosmosChainId.Andromeda:
      return {
        rpc: 'https://rpc.cosmos.directory/andromeda',
        rest: 'https://rest.cosmos.directory/andromeda',
      }
    case CosmosChainId.Saga:
      return {
        rpc: 'https://saga-rpc.publicnode.com',
        rest: 'https://saga-rest.publicnode.com',
      }
    default:
      throw new GeneralException(
        new Error(`Endpoints for ${chainId} not found`),
      )
  }
}
