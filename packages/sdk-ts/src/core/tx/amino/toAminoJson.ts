import { GeneralException } from '@injectivelabs/exceptions'
import { uint8ArrayToBase64 } from '../../../utils/encoding-light.js'
import type { FieldInfo, MessageType } from '@protobuf-ts/runtime'

/**
 * amino-json encoder for protobuf-ts messages, mirroring the chain's
 * `cosmossdk.io/x/tx/signing/aminojson` encoder (Injective fork v0.50.15-inj.2),
 * which re-derives the sign bytes of SIGN_MODE_LEGACY_AMINO_JSON from the decoded proto tx.
 *
 * Rules (from json_marshal.go / encoder.go / options.go):
 * - field names are the proto (snake_case) names, zero values (`""`, `0`, `false`, empty
 *   bytes / repeated) are omitted unless `amino.dont_omitempty`
 * - `LegacyDec`/`math.Int` customtypes without the `cosmos.Dec` scalar are emitted as the raw
 *   stored string (18-decimals scaled integer), i.e. exactly what the proto holds
 * - 64-bit integers are strings, 32-bit integers and enums are numbers, bytes are base64
 * - a oneof is emitted as `{ <Oneof>: { type: <amino.oneof_name>, value: { <field>: ... } } }`
 *   (or `<Oneof>: null` when unset)
 * - `google.protobuf.Any` is emitted as `{ type: <amino.name of the content>, value: ... }`
 *   and must be resolvable through `anyTypes`
 */

type AnyMessage = Record<string, any>

const SCALAR_INT64 = 3
const SCALAR_UINT64 = 4
const SCALAR_FIXED64 = 6
const SCALAR_BOOL = 8
const SCALAR_BYTES = 12
const SCALAR_SFIXED64 = 16
const SCALAR_SINT64 = 18

const LONG_SCALARS = new Set([
  SCALAR_INT64,
  SCALAR_UINT64,
  SCALAR_FIXED64,
  SCALAR_SFIXED64,
  SCALAR_SINT64,
])

// amino options of the chain encoder that this implementation does NOT support. A message
// using one would be encoded differently by the chain, so we refuse instead of signing wrong bytes.
const UNSUPPORTED_MESSAGE_OPTIONS = ['amino.message_encoding']
const UNSUPPORTED_FIELD_OPTIONS = ['amino.field_name']
// `legacy_coins` (empty list as `[]`) is implemented, any other amino.encoding is not
const SUPPORTED_FIELD_ENCODINGS = ['legacy_coins']
const UNSUPPORTED_SCALARS = ['cosmos.Dec']

const assertSupported = (type: MessageType<any>, field?: FieldInfo) => {
  const encoding = field?.options?.['amino.encoding'] as string | undefined
  const unsupported = field
    ? [
        ...UNSUPPORTED_FIELD_OPTIONS.filter((o) => field.options?.[o]),
        ...(encoding && !SUPPORTED_FIELD_ENCODINGS.includes(encoding)
          ? [`amino.encoding=${encoding}`]
          : []),
        ...(UNSUPPORTED_SCALARS.includes(
          field.options?.['cosmos_proto.scalar'] as string,
        )
          ? [`cosmos_proto.scalar=${field.options?.['cosmos_proto.scalar']}`]
          : []),
      ]
    : UNSUPPORTED_MESSAGE_OPTIONS.filter((o) => type.options?.[o])

  if (unsupported.length > 0) {
    throw new GeneralException(
      new Error(
        `toAminoJson: ${type.typeName}${field ? `.${field.name}` : ''} uses unsupported amino option(s) ${unsupported.join(', ')}`,
      ),
    )
  }
}

const ANY_TYPE_NAME = 'google.protobuf.Any'
const UNSUPPORTED_WELL_KNOWN = new Set([
  'google.protobuf.Timestamp',
  'google.protobuf.Duration',
])

// strcase.ToCamel, used by the chain encoder for the oneof wrapper key
const toUpperCamel = (name: string) =>
  name
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')

const isZeroScalar = (field: FieldInfo, value: unknown) => {
  if (field.kind !== 'scalar' && field.kind !== 'enum') {
    return false
  }

  if (value === undefined || value === null) {
    return true
  }

  if (field.kind === 'scalar' && field.T === SCALAR_BOOL) {
    return value === false
  }

  if (field.kind === 'scalar' && field.T === SCALAR_BYTES) {
    return (value as Uint8Array).length === 0
  }

  if (typeof value === 'string') {
    // a 64-bit integer can arrive as a string, "0" is zero only for those
    return field.kind === 'scalar' && LONG_SCALARS.has(field.T as number)
      ? value === '0'
      : value === ''
  }

  return value === 0 || value === 0n
}

const encodeScalar = (field: FieldInfo, value: any) => {
  if (field.kind === 'enum') {
    return value
  }

  // cosmos.Int scalar: an empty string is `"0"`, otherwise the string as is
  if (field.options?.['cosmos_proto.scalar'] === 'cosmos.Int') {
    return value === '' || value === undefined ? '0' : value
  }

  const type = field.kind === 'scalar' ? (field.T as number) : undefined

  if (type !== undefined && LONG_SCALARS.has(type)) {
    return String(value)
  }

  if (type === SCALAR_BYTES) {
    return uint8ArrayToBase64(value)
  }

  return value
}

const encodeValue = (
  field: FieldInfo,
  value: any,
  anyTypes: Record<string, MessageType<any>>,
): unknown => {
  if (field.kind === 'message') {
    const type = field.T() as MessageType<any>

    if (type.typeName === ANY_TYPE_NAME) {
      return encodeAny(value, anyTypes)
    }

    if (UNSUPPORTED_WELL_KNOWN.has(type.typeName)) {
      throw new GeneralException(
        new Error(
          `toAminoJson: ${type.typeName} is not supported (field ${field.name})`,
        ),
      )
    }

    return encodeMessage(type, value, anyTypes)
  }

  if (field.kind === 'map') {
    throw new GeneralException(
      new Error(`toAminoJson: map fields are not supported (${field.name})`),
    )
  }

  return encodeScalar(field, value)
}

const encodeAny = (
  any: { typeUrl: string; value: Uint8Array },
  anyTypes: Record<string, MessageType<any>>,
) => {
  const type = anyTypes[any.typeUrl]

  if (!type) {
    throw new GeneralException(
      new Error(`toAminoJson: unknown Any type ${any.typeUrl}`),
    )
  }

  return {
    type: type.options['amino.name'],
    value: encodeMessage(type, type.fromBinary(any.value), anyTypes),
  }
}

const encodeMessage = (
  type: MessageType<any>,
  message: AnyMessage,
  anyTypes: Record<string, MessageType<any>>,
): Record<string, unknown> => {
  const output: Record<string, unknown> = {}
  const oneofsWritten = new Set<string>()

  assertSupported(type)

  for (const field of type.fields) {
    assertSupported(type, field)

    const dontOmitEmpty = field.options?.['amino.dont_omitempty'] === true

    if (field.oneof) {
      const oneof = message[field.oneof] as
        | { oneofKind: string | undefined; [key: string]: any }
        | undefined
      const wrapperKey = toUpperCamel(field.oneof)

      if (!oneof || oneof.oneofKind === undefined) {
        if (!oneofsWritten.has(field.oneof)) {
          output[wrapperKey] = null
          oneofsWritten.add(field.oneof)
        }

        continue
      }

      if (oneof.oneofKind !== field.localName) {
        continue
      }

      output[wrapperKey] = {
        type: field.options?.['amino.oneof_name'],
        value: {
          [field.name]: encodeValue(field, oneof[field.localName], anyTypes),
        },
      }
      continue
    }

    const value = message[field.localName]

    if (field.repeat) {
      if (!value || value.length === 0) {
        // `dont_omitempty` (and `legacy_coins`) write an empty list as `[]`
        if (dontOmitEmpty) {
          output[field.name] = []
        }

        continue
      }

      output[field.name] = (value as any[]).map((v) =>
        encodeValue(field, v, anyTypes),
      )
      continue
    }

    if (field.kind === 'message') {
      if (value === undefined || value === null) {
        if (dontOmitEmpty) {
          // the chain encoder errors on this combination
          throw new GeneralException(
            new Error(
              `toAminoJson: ${type.typeName}.${field.name} is dont_omitempty but unset`,
            ),
          )
        }

        continue
      }
    } else if (isZeroScalar(field, value) && !dontOmitEmpty) {
      continue
    }

    output[field.name] = encodeValue(field, value, anyTypes)
  }

  return output
}

/** the amino-json `value` of any message, nested messages do not need an `amino.name` */
export const toAminoJsonValue = <T extends object>(
  type: MessageType<T>,
  message: T,
  anyTypes: Record<string, MessageType<any>> = {},
): Record<string, any> => encodeMessage(type, message as AnyMessage, anyTypes)

/** amino-json of a top-level (signable) message: `{ type: <amino.name>, value }` */
export const toAminoJson = <T extends object>(
  type: MessageType<T>,
  message: T,
  anyTypes: Record<string, MessageType<any>> = {},
): { type: string; value: Record<string, any> } => {
  const aminoName = type.options['amino.name']

  if (typeof aminoName !== 'string') {
    throw new GeneralException(
      new Error(`toAminoJson: ${type.typeName} has no amino.name`),
    )
  }

  return { type: aminoName, value: toAminoJsonValue(type, message, anyTypes) }
}
