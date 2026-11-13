import * as CosmosGovV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/gov/v1beta1/tx_pb'
import * as InjectiveExchangeV2TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/tx_pb'
import * as InjectiveInsuranceV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/insurance/v1beta1/tx_pb'
import { assertAminoJsonSupported } from './toAminoJson.js'
import type { MessageType } from '@protobuf-ts/runtime'

const isMsg = (m: unknown): m is MessageType<any> =>
  typeof (m as MessageType<any>)?.typeName === 'string' &&
  /\.Msg[A-Za-z]+$/.test((m as MessageType<any>).typeName)

// sign-payload helpers, not transactions: they have no amino.name by design
const NOT_SIGNABLE = [
  'injective.exchange.v2.MsgSignData',
  'injective.exchange.v2.MsgSignDoc',
]

// These existing proto types contain Duration; no SDK builder uses this encoder for them.
const UNSUPPORTED_TYPES = [
  'injective.insurance.v1beta1.MsgUpdateParams',
  'injective.insurance.v1beta1.Params',
  'google.protobuf.Duration',
]

const roots = [
  ...Object.values(InjectiveExchangeV2TxPb),
  ...Object.values(InjectiveInsuranceV1Beta1TxPb),
  CosmosGovV1Beta1TxPb.MsgSubmitProposal,
]
  .filter(isMsg)
  .filter(
    (msg) =>
      !msg.typeName.endsWith('Response') &&
      !NOT_SIGNABLE.includes(msg.typeName),
  )

const collectReachableTypes = (
  type: MessageType<any>,
  seen = new Map<string, MessageType<any>>(),
) => {
  if (!seen.has(type.typeName)) {
    seen.set(type.typeName, type)
    type.fields.forEach((field) => {
      if (field.kind === 'message') {
        collectReachableTypes(field.T() as MessageType<any>, seen)
      }
    })
  }

  return seen
}

// A proto bump that adds an amino option the encoder does not implement (or a
// Timestamp/Duration/map field) to one of these messages would otherwise only surface
// at signing time on Ledger. This fails the test suite instead.
describe('toAminoJson schema compatibility for V2 exchange / insurance / gov msgs', () => {
  const reachable = new Map<string, MessageType<any>>()

  roots.forEach((root) => collectReachableTypes(root, reachable))

  it('covers a meaningful number of types', () => {
    expect(roots.length).toBeGreaterThan(50)
    expect(reachable.size).toBeGreaterThan(100)
  })

  it.each(
    roots
      .filter((root) => !root.typeName.endsWith('Response'))
      .map((root) => [root.typeName, root]),
  )('%s is signable (has an amino.name)', (_name, root) => {
    expect(root.options['amino.name']).toBeTypeOf('string')
  })

  it.each(
    [...reachable.entries()].filter(
      ([name]) => name !== 'google.protobuf.Any' && !name.endsWith('Response'),
    ),
  )('%s', (name, type) => {
    if (UNSUPPORTED_TYPES.includes(name)) {
      expect(() => assertAminoJsonSupported(type)).toThrow(
        'google.protobuf.Duration is not supported',
      )
    } else {
      expect(() => assertAminoJsonSupported(type)).not.toThrow()
    }
  })
})
