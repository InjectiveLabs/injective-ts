// Test import for bundle analysis
import { CosmosWallet } from '../dist/esm/index.js'

// Use the imports to ensure they're included in the bundle
console.log('Wallet-cosmos package loaded:', CosmosWallet.name)
