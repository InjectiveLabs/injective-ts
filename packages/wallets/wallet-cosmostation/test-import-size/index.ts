// Test import for bundle analysis
import { CosmostationWalletStrategy } from '../dist/esm/index.js'

// Use the imports to ensure they're included in the bundle
console.log(
  'Wallet-cosmostation package loaded:',
  CosmostationWalletStrategy.name,
)
