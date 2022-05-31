import { Message } from 'google-protobuf'
import { Any } from 'google-protobuf/google/protobuf/any_pb'

export interface MessageGenerated {
  value: Message
  type: string
}

export const createAnyMessage = (msg: MessageGenerated) => {
  const message = new Any()
  message.setTypeUrl(`${msg.type.startsWith('/') ? '' : '/'}${msg.type}`)
  message.setValue(msg.value.serializeBinary())

  return message
}

export const createAny = (value: any, type: string) => {
  const message = new Any()
  message.setTypeUrl(type)
  message.setValue(value)

  return message
}
