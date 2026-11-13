import type { MessageType } from '@protobuf-ts/runtime'

/** `/<proto type name>`: the type URL of a message */
export const toTypeUrl = (type: MessageType<any>) => `/${type.typeName}`
