import { msgTypeToMsgValueMap } from './types'

export class Eip712MessageTypeFactory {
  static make(type: string) {
    const messageType = type.split('/').pop()
    const existingTypesMap = Object.keys(msgTypeToMsgValueMap)

    if (!messageType) {
      throw new Error(`Unknown EIP712 message type ${type}`)
    }

    if (!existingTypesMap.includes(messageType)) {
      throw new Error(`Unknown EIP712 message type ${type}`)
    }

    return msgTypeToMsgValueMap[messageType]
  }
}
