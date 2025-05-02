import { skipClient } from './client'

describe('Skip Integration', () => {
  it('should be able to connect to Skip', async () => {
    const cosmosChains = await skipClient.chains()
    const allChains = await skipClient.chains({
      includeEVM: true,
      includeSVM: true,
    })

    const route = await skipClient.route({
      sourceAssetDenom: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      sourceAssetChainID: 'solana',
      destAssetDenom:
        'ibc/2CBC2EA121AE42563B08028466F37B600F2D7D4282342DE938283CC3FB2BC00E',
      destAssetChainID: 'injective-1',
      amountIn: '1000000',
      smartRelay: true,
    });

    console.log(cosmosChains)
    console.log(allChains)
    console.log(route)
  })
})
