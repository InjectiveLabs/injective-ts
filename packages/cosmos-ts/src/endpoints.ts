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
        rpc: 'https://tm.injective.network/',
        rest: 'https://lcd.injective.network/',
      }
    case CosmosChainId.Terra:
      return {
        rpc: 'https://terra-rpc.easy2stake.com/',
        rest: 'https://blockdaemon-terra-lcd.api.bdnodes.net:1317',
      }
    case TestnetCosmosChainId.Cosmoshub:
      return {
        rpc: 'https://testnet.tm.cosmos.injective.dev',
        rest: 'https://testnet.lcd.cosmos.injective.dev/',
      }
    case TestnetCosmosChainId.Injective:
      return {
        rpc: 'https://testnet.tm.injective.dev/',
        rest: 'https://testnet.lcd.injective.dev/',
      }
    default:
      throw new Error(`Endpoints for ${chainId} not found`)
  }
}
