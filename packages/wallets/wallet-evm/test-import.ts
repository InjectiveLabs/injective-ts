// Test import for bundle analysis
import { EvmWalletStrategy } from './src/index.js'

// Use the imports to ensure they're included in the bundle
console.log('Wallet-evm package loaded:', EvmWalletStrategy.name)
