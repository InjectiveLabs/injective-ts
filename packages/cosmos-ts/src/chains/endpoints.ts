import { CosmosChainId, TestnetCosmosChainId } from './types'

export const getEndpointFromChainId = (
  chainId: TestnetCosmosChainId | CosmosChainId,
): { rpc: string; rest: string } => {
  switch (chainId) {
    case CosmosChainId.Cosmoshub:
      return {
        rpc: 'https://tm.cosmos.injective.network',
        rest: 'https://lcd-cosmoshub.keplr.app',
      }
    case CosmosChainId.Osmosis:
      return {
        rpc: 'https://tm.osmosis.injective.network',
        rest: 'https://lcd-osmosis.keplr.app',
      }
    case CosmosChainId.Injective:
      return {
        rpc: 'https://tm.injective.network',
        rest: 'https://lcd.injective.network',
      }
    case CosmosChainId.Juno:
      return {
        rpc: 'https://rpc-juno.itastakers.com',
        rest: 'https://lcd-juno.itastakers.com',
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
    case CosmosChainId.Chihuahua:
      return {
        rpc: 'https://rpc.chihuahua.wtf',
        rest: 'https://api.chihuahua.wtf',
      }
    case CosmosChainId.Axelar:
      return {
        rpc: 'https://rpc-axelar.keplr.app',
        rest: 'https://lcd-axelar.keplr.app',
      }
    case CosmosChainId.Evmos:
      return {
        rpc: 'https://rpc-evmos.keplr.app',
        rest: 'https://lcd-evmos.keplr.app',
      }
    case CosmosChainId.Persistence:
      return {
        rpc: 'https://rpc-persistence.keplr.app',
        rest: 'https://lcd-persistence.keplr.app',
      }
    default:
      throw new Error(`Endpoints for ${chainId} not found`)
  }
}
