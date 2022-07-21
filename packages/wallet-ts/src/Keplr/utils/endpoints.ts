import {
  ChainId,
  CosmosChainId,
  TestnetCosmosChainId,
  DevnetCosmosChainId,
} from '@injectivelabs/ts-types'

export const getEndpointsFromChainId = (
  chainId: TestnetCosmosChainId | CosmosChainId | ChainId | DevnetCosmosChainId,
): { rpc: string; rest: string } => {
  switch (chainId) {
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
    case CosmosChainId.Injective:
      return {
        rpc: 'https://tm.injective.network',
        rest: 'https://lcd.injective.network',
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
    case TestnetCosmosChainId.Cosmoshub:
      return {
        rpc: 'https://testnet.tm.cosmos.injective.dev',
        rest: 'https://testnet.lcd.cosmos.injective.dev',
      }
    case TestnetCosmosChainId.Injective:
      return {
        rpc: 'https://testnet.tm.injective.dev',
        rest: 'https://testnet.lcd.injective.dev',
      }
    case DevnetCosmosChainId.Injective:
      return {
        rpc: 'https://devnet.tm.injective.dev',
        rest: 'https://devnet.lcd.injective.dev',
      }
    case CosmosChainId.Chihuahua:
      return {
        rpc: 'https://rpc.chihuahua.wtf',
        rest: 'https://api.chihuahua.wtf',
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
    default:
      throw new Error(`Endpoints for ${chainId} not found`)
  }
}
