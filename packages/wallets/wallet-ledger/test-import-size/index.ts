// Test import for bundle analysis
import { LedgerLiveStrategy } from '../dist/esm/index.js'

// Use the imports to ensure they're included in the bundle
console.log('Wallet-ledger package loaded:', LedgerLiveStrategy.name)
