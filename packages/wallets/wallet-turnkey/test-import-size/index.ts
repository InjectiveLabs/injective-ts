// Test import for bundle analysis
import { TurnkeyWalletStrategy } from '../dist/esm/index.js'

// Use the imports to ensure they're included in the bundle
console.log('Wallet-turnkey package loaded:', TurnkeyWalletStrategy.name)
