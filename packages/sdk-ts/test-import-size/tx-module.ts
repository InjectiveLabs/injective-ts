// Test tree-shaking for transaction module
import {
  MsgBroadcasterWithPk
} from '../dist/esm/index.js'

console.log('TX module loaded:', {
  MsgBroadcasterWithPk: MsgBroadcasterWithPk.name
})
