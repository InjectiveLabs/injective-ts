type CosmosWalletStrategyClass =
  typeof import('@injectivelabs/wallet-cosmos').CosmosWalletStrategy

let cachedCosmosWalletStrategy: CosmosWalletStrategyClass | null = null

export const loadCosmosWalletStrategy =
  async (): Promise<CosmosWalletStrategyClass> => {
    if (!cachedCosmosWalletStrategy) {
      cachedCosmosWalletStrategy = (
        await import('@injectivelabs/wallet-cosmos')
      ).CosmosWalletStrategy
    }

    return cachedCosmosWalletStrategy
  }
