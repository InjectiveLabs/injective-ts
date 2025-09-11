// Test import for utils-specific functionality
import { getNetworkInfo } from '../dist/esm/index.js'

// Test just the utils function
const network = getNetworkInfo('mainnet')
console.log('Utils function loaded:', network.chainId)
