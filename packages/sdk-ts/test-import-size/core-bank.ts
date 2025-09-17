// Test tree-shaking for core bank module
import { MsgSend, MsgMultiSend } from '../dist/esm/index.js'

// Use the imports to ensure they're included in the bundle
console.log('Core Bank module loaded:', {
  MsgSend: MsgSend.name,
  MsgMultiSend: MsgMultiSend.name,
})
