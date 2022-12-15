import { TypedDataField } from './../types'
import { eip712Types as msgExecuteContractTypes } from './MsgExecuteContract'

/**
 * For some messages its impossible to generate proper
 * EIP712 typed data on JavaScript level so we have to
 * hardcode them
 */
export const hardcodedEip712Types = {
  'wasm/MsgExecuteContract': msgExecuteContractTypes,
} as Record<string, Map<string, TypedDataField[]>>
