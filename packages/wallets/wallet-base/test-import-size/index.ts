// Test import for bundle analysis
import { BaseConcreteStrategy } from '../dist/esm/index.js'

// Use the imports to ensure they're included in the bundle
console.log('Wallet-base package loaded:', BaseConcreteStrategy.name)
