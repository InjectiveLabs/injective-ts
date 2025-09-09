// Test import for bundle analysis
import { ChainRestBankApi, MsgSend } from '../dist/esm/index.js'

// Use the imports to ensure they're included in the bundle
console.log('SDK-TS package loaded:', ChainRestBankApi.name, MsgSend.name)
