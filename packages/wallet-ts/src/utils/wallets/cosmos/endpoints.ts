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
        rpc: 'https://k8s.testnet.tm.injective.network',
        rest: 'https://k8s.testnet.lcd.injective.network',
      }
    case DevnetCosmosChainId.Injective:
      return {
        rpc: 'https://devnet.tm.injective.dev',
        rest: 'https://devnet.lcd.injective.dev',
      }
    case CosmosChainId.Cosmoshub:
      return {
        rpc: 'https://tm.cosmos.injective.network',
        rest: 'https://lcd.cosmos.injective.network',
      }
    case CosmosChainId.Osmosis:
      return {
        rpc: 'https://tm.osmosis.injective.network',
        rest: 'https://lcd.osmosis.injective.network',
      }
    case CosmosChainId.Juno:
      return {
        rpc: 'https://tm.juno.injective.network',
        rest: 'https://lcd.juno.injective.network',
      }
    case CosmosChainId.Terra:
      return {
        rpc: 'https://tm.terra.injective.network',
        rest: 'https://lcd.terra.injective.network',
      }
    case CosmosChainId.TerraUST:
      return {
        rpc: 'https://tm.terra.injective.network',
        rest: 'https://lcd.terra.injective.network',
      }
    case CosmosChainId.Axelar:
      return {
        rpc: 'https://tm.axelar.injective.network',
        rest: 'https://lcd.axelar.injective.network',
      }
    case CosmosChainId.Evmos:
      return {
        rpc: 'https://tm.evmos.injective.network',
        rest: 'https://lcd.evmos.injective.network',
      }
    case CosmosChainId.Persistence:
      return {
        rpc: 'https://tm.persistence.injective.network',
        rest: 'https://lcd.persistence.injective.network',
      }
    case CosmosChainId.Secret:
      return {
        rpc: 'https://tm.secret.injective.network',
        rest: 'https://lcd.secret.injective.network',
      }
    case CosmosChainId.Stride:
      return {
        rpc: 'https://tm.stride.injective.network',
        rest: 'https://lcd.stride.injective.network',
      }
    case CosmosChainId.Chihuahua:
      return {
        rpc: 'https://rpc.chihuahua.wtf',
        rest: 'https://api.chihuahua.wtf',
      }
    case CosmosChainId.Crescent:
      return {
        rpc: 'https://tm.crescent.injective.network',
        rest: 'https://lcd.crescent.injective.network',
      }
    case CosmosChainId.Sommelier:
      return {
        rpc: 'https://tm.sommelier.injective.network',
        rest: 'https://lcd.sommelier.injective.network',
      }
    case CosmosChainId.Canto:
      return {
        rpc: 'https://tm.canto.injective.network',
        rest: 'https://lcd.canto.injective.network',
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
