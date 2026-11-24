import { GeneralException } from '@injectivelabs/exceptions'
import type { TypedDataField } from './types.js'

const EIP712_V1_HINT = 'Please use EIP712_v2'

/** The chain cannot hash a declared v1 field whose Amino value was omitted, or a non-array for an array type. */
export const assertEip712V1Values = (
  value: unknown,
  types: Map<string, TypedDataField[]>,
  type = 'MsgValue',
  path = 'value',
): void => {
  const fields = types.get(type)

  if (!fields) {
    return
  }

  for (const field of fields) {
    const fieldPath = `${path}.${field.name}`
    const fieldValue =
      typeof value === 'object' && value !== null
        ? (value as Record<string, unknown>)[field.name]
        : undefined

    if (fieldValue === undefined || fieldValue === null) {
      throw new GeneralException(
        new Error(
          `EIP712_v1 cannot sign an omitted field (${fieldPath}). Please use EIP712_v2`,
        ),
      )
    }

    if (field.type.endsWith('[]')) {
      // the chain's typed-data encoder cannot hash anything but an array for an array type
      // (e.g. the base64 string it carries for `bytes`)
      if (!Array.isArray(fieldValue)) {
        throw new GeneralException(
          new Error(
            `EIP712_v1 cannot sign a non-array value for an array field (${fieldPath}). ${EIP712_V1_HINT}`,
          ),
        )
      }

      fieldValue.forEach((entry, index) =>
        assertEip712V1Values(
          entry,
          types,
          field.type.slice(0, -2),
          `${fieldPath}[${index}]`,
        ),
      )
    } else {
      assertEip712V1Values(fieldValue, types, field.type, fieldPath)
    }
  }
}
