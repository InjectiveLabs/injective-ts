// Test tree-shaking with minimal imports
import { MsgSend } from '../dist/esm/index.js'

console.log('Minimal import loaded:', MsgSend.name)
