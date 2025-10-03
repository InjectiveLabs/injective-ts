// Test tree-shaking for core exchange module
import {
  MsgCancelSpotOrder,
  MsgCancelDerivativeOrder,
  MsgCancelBinaryOptionsOrder,
} from '../dist/esm/index.js'

// Use the imports to ensure they're included in the bundle
console.log('Core Exchange module loaded:', {
  MsgCancelSpotOrder: MsgCancelSpotOrder.name,
  MsgCancelDerivativeOrder: MsgCancelDerivativeOrder.name,
  MsgCancelBinaryOptionsOrder: MsgCancelBinaryOptionsOrder.name,
})
