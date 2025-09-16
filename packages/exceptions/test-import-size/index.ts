// Test import for bundle analysis
import { GeneralException } from '../dist/esm/index.js'

// Use the imports to ensure they're included in the bundle
const testException = new GeneralException(new Error('Test message'))
console.log('Exception package loaded:', testException.message)
