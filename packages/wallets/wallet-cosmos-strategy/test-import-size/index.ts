// Test import for bundle analysis
import { BaseCosmosWalletStrategy } from '../dist/esm/index.js'

// Use the imports to ensure they're included in the bundle
console.log('Wallet-cosmos-strategy package loaded:', BaseCosmosWalletStrategy.name)
