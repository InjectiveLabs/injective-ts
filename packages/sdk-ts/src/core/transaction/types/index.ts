import type { Message } from 'google-protobuf'

export * from './tx'
export * from './tx-rest-client'

export interface MessageGenerated {
  value: Message
  type: string
}
