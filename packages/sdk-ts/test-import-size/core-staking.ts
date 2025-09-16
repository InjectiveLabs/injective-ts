// Test tree-shaking for core staking module
import {
  MsgDelegate,
  MsgUndelegate,
  MsgBeginRedelegate,
  MsgCreateValidator,
  MsgEditValidator
} from '../dist/esm/index.js'

// Use the imports to ensure they're included in the bundle
console.log('Core Staking module loaded:', {
  MsgDelegate: MsgDelegate.name,
  MsgUndelegate: MsgUndelegate.name,
  MsgBeginRedelegate: MsgBeginRedelegate.name,
  MsgCreateValidator: MsgCreateValidator.name,
  MsgEditValidator: MsgEditValidator.name
})
