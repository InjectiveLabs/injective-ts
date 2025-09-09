// Test import for bundle analysis
import { Network, getNetworkInfo } from './../dist/esm/index.js'

// Use the imports to ensure they're included in the bundle
const network = getNetworkInfo('mainnet')

console.log('Network package loaded:', network.chainId)
