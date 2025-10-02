// Test import for bundle analysis
import { StreamOperation } from '../dist/esm/index.js'
import type { ChainId } from '../dist/esm/index.js'

// Use the imports to ensure they're included in the bundle
const chainId: ChainId = 'injective-1'
console.log('TS-Types package loaded:', chainId, StreamOperation.Insert)
