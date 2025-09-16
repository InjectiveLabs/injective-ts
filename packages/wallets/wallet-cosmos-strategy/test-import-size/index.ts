// Test import for bundle analysis
import { CosmosWalletStrategy } from '../dist/esm/index.js'

// Use the imports to ensure they're included in the bundle
console.log('Wallet-cosmos-strategy package loaded:', CosmosWalletStrategy.name)
