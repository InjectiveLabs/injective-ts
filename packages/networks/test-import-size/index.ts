// Test import for bundle analysis
import {
  Network,
  getNetworkInfo,
  getCw20AdapterContractForNetwork,
} from './../dist/esm/index.js'

// Use the imports to ensure they're included in the bundle
const network = getNetworkInfo(Network.Mainnet)
const cw20AdapterContract = getCw20AdapterContractForNetwork(Network.Mainnet)

console.log('Network package loaded:', network.chainId)
console.log('Cw20 adapter contract:', cw20AdapterContract)
