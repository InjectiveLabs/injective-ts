// Test import for bundle analysis
import { TrezorBip44Strategy } from './src/index.js'

// Use the imports to ensure they're included in the bundle
console.log('Wallet-trezor package loaded:', TrezorBip44Strategy.name)
