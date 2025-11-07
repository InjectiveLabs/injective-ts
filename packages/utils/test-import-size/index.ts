// Test import for bundle analysis
import { sleep, awaitAll, toChainFormat } from '../dist/esm/index.js'

// Use the imports to ensure they're included in the bundle
const formatted = toChainFormat(1)
sleep(1)
awaitAll([1, 2, 3], async (item) => item)
console.log('Utils package loaded:', formatted)
