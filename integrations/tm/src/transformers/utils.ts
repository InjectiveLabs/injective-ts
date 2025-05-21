import { ChainEvent } from '../types/block'

function baseFindAttribute(
  tradeEvent: ChainEvent,
  key: string,
  options?: {
    removeQuotes: boolean
  },
) {
  const attribute = tradeEvent.attributes.find((attr) => attr.key === key)

  if (options?.removeQuotes) {
    return attribute?.value.replaceAll('"', '') || 'missing-attribute'
  }

  return attribute?.value || 'missing-attribute'
}

export function findJSONAttribute(tradeEvent: ChainEvent, key: string) {
  return JSON.parse(baseFindAttribute(tradeEvent, key))
}

export function findAttribute(tradeEvent: ChainEvent, key: string) {
  return baseFindAttribute(tradeEvent, key, {
    removeQuotes: true,
  })
}
