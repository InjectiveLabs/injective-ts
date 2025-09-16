// Test import for network-specific functionality
import { Network } from '../dist/esm/types.js'

// Test just the Network class
const network = new Network('mainnet', 'injective-1', 'Injective')
console.log('Network class loaded:', network.chainId)
