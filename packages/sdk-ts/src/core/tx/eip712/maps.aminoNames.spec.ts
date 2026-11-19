import * as InjectiveExchangeV2TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/tx_pb'
import { protoTypeToAminoType } from './maps.js'

type ProtoMessageType = { typeName: string; options?: Record<string, unknown> }

const mapped = (Object.values(InjectiveExchangeV2TxPb) as unknown[])
  .filter(
    (m): m is ProtoMessageType =>
      typeof (m as ProtoMessageType)?.typeName === 'string' &&
      typeof (m as ProtoMessageType).options?.['amino.name'] === 'string',
  )
  .flatMap((m) => {
    try {
      return [
        {
          typeName: m.typeName,
          expected: m.options!['amino.name'] as string,
          actual: protoTypeToAminoType(m.typeName),
        },
      ]
    } catch {
      return [] // not mapped by the SDK
    }
  })

// guards against drift between protoTypeToAminoType and the chain's `amino.name`
describe('protoTypeToAminoType exchange v2 amino names', () => {
  it('maps a meaningful number of v2 messages', () => {
    expect(mapped.length).toBeGreaterThan(20)
  })

  it.each(mapped.map((m) => [m.typeName, m.expected, m.actual]))(
    '%s uses the proto amino.name',
    (_typeName, expected, actual) => {
      expect(actual).toBe(expected)
    },
  )
})
