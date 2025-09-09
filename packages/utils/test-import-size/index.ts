// Test import for bundle analysis
import { toChainFormat, sleep, awaitAll } from '../dist/esm/index.js'

// Use the imports to ensure they're included in the bundle
const formatted = toChainFormat(1)
console.log('Utils package loaded:', formatted)
