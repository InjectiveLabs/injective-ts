// Test import for bundle analysis
import { WalletConnectStrategy } from '../dist/esm/index.js'

// Use the imports to ensure they're included in the bundle
console.log(
  'Wallet-wallet-connect package loaded:',
  WalletConnectStrategy.name,
)
