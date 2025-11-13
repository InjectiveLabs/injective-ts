// Test import for network-specific functionality
import { Network, getNetworkChainInfo } from '../dist/esm/index.js'

// Test just the Network enum and functions
const network = Network.Mainnet
const chainInfo = getNetworkChainInfo(network)
console.log('Network enum loaded:', network)
console.log('Chain info loaded:', chainInfo.chainId)
