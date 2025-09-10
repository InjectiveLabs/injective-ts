// Test tree-shaking for type definitions only
import type {
  Msgs,
  ExchangeMsgs
} from '../dist/esm/index.js'

// Use the imports to ensure they're included in the bundle
console.log('Types module loaded:', {
  Msgs: 'Msgs type',
  ExchangeMsgs: 'ExchangeMsgs type'
})
