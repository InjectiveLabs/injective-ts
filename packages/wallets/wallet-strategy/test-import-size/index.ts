// Test import for bundle analysis
import { WalletStrategy } from '../dist/esm/index.js'

// Use the imports to ensure they're included in the bundle
console.log('Wallet-strategy package loaded:', WalletStrategy.name)
