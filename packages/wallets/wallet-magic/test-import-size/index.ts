// Test import for bundle analysis
import { MagicStrategy } from '../dist/esm/index.js'

// Use the imports to ensure they're included in the bundle
console.log('Wallet-magic package loaded:', MagicStrategy.name)
