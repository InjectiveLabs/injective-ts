// Test import for utils functionality
import { getNetworkInfo } from './../dist/esm/index.js'

// Test just the utils functions
const networkInfo = getNetworkInfo('testnet')
console.log('Utils loaded:', networkInfo.chainId)
