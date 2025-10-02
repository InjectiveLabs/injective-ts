// Test tree-shaking for utility functions only
import { MsgBroadcasterWithPk } from '../dist/esm/index.js'

// Use the imports to ensure they're included in the bundle
console.log('Utils module loaded:', {
  MsgBroadcasterWithPk: MsgBroadcasterWithPk.name,
})
