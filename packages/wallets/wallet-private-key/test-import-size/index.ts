// Test import for bundle analysis
import { PrivateKeyWalletStrategy } from '../dist/esm/index.js'

// Use the imports to ensure they're included in the bundle
console.log('Wallet-private-key package loaded:', PrivateKeyWalletStrategy.name)
