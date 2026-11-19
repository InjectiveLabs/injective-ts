import type { MessageType } from '@protobuf-ts/runtime'

export const toTypeUrl = (type: MessageType<any>) => `/${type.typeName}`
