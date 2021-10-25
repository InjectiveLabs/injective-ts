import { CosmosChainId, TestnetCosmosChainId } from './types'

export const getLcdEndpointFromChainId = (
  chainId: TestnetCosmosChainId | CosmosChainId,
): { rpc: string; rest: string } => {
  switch (chainId) {
    case CosmosChainId.Cosmoshub:
      return {
        rpc: 'https://rpc-cosmoshub.keplr.app',
        rest: 'https://lcd-cosmoshub.keplr.app',
      }
    case CosmosChainId.Injective:
      return {
        rpc: 'https://lcd.injective.network/',
        rest: 'https://tm.injective.network/',
      }
    case TestnetCosmosChainId.Cosmoshub:
      return {
        rpc: 'https://rpc.testnet.cosmos.network/',
        rest: 'https://api.testnet.cosmos.network/',
      }
    case TestnetCosmosChainId.Injective:
      return {
        rpc: 'https://testnet.lcd.injective.dev/',
        rest: 'https://testnet.tm.injective.dev/',
      }
    default:
      throw new Error(`Endpoints for ${chainId} not found`)
  }
}
