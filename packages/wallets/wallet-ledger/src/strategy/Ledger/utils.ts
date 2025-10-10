import {
  toBytes,
  keccak256,
  encodeAbiParameters,
  parseAbiParameters,
} from 'viem'

type TypeDefinition = Record<string, Array<{ name: string; type: string }>>

interface EIP712Message {
  types: TypeDefinition
  domain: Record<string, any>
  primaryType: string
  message: Record<string, any>
}

function findTypeDependencies(
  primaryType: string,
  types: TypeDefinition,
  results = new Set<string>(),
): string[] {
  // Already processed or type doesn't exist
  if (results.has(primaryType) || !types[primaryType]) {
    return Array.from(results)
  }

  results.add(primaryType)

  // Check each field for custom types
  for (const field of types[primaryType]) {
    const baseType = field.type.replace(/\[\]$/, '') // Remove array suffix
    if (types[baseType]) {
      findTypeDependencies(baseType, types, results)
    }
  }

  return Array.from(results)
}

function formatTypeSignature(
  typeName: string,
  fields: Array<{ name: string; type: string }>,
): string {
  const fieldStrings = fields.map((f) => `${f.type} ${f.name}`)

  return `${typeName}(${fieldStrings.join(',')})`
}

function encodeType(primaryType: string, types: TypeDefinition): string {
  // Get all dependencies and sort them (primary type first, rest alphabetically)
  const dependencies = findTypeDependencies(primaryType, types)
    .filter((t) => t !== primaryType)
    .sort()

  const orderedTypes = [primaryType, ...dependencies]

  return orderedTypes
    .map((typeName) => {
      const fields = types[typeName]

      return fields ? formatTypeSignature(typeName, fields) : ''
    })
    .filter(Boolean) // Remove empty strings
    .join('')
}

function hashType(primaryType: string, types: TypeDefinition): `0x${string}` {
  return keccak256(toBytes(encodeType(primaryType, types)))
}

function encodeFieldValue(
  fieldType: string,
  value: any,
  types: TypeDefinition,
): { encodedType: string; encodedValue: any } {
  if (fieldType === 'string') {
    return {
      encodedType: 'bytes32',
      encodedValue: keccak256(toBytes(value)),
    }
  }

  if (fieldType === 'bytes') {
    return {
      encodedType: 'bytes32',
      encodedValue: keccak256(
        typeof value === 'string' ? toBytes(value) : value,
      ),
    }
  }

  if (types[fieldType]) {
    return {
      encodedType: 'bytes32',
      encodedValue: hashStruct(fieldType, value, types),
    }
  }

  if (fieldType.endsWith(']')) {
    throw new Error(`Array type "${fieldType}" is not supported`)
  }

  return {
    encodedType: fieldType,
    encodedValue: value,
  }
}

function encodeData(
  primaryType: string,
  data: Record<string, any>,
  types: TypeDefinition,
): `0x${string}` {
  const encodedTypes: string[] = ['bytes32']
  const encodedValues: any[] = [hashType(primaryType, types)]

  for (const field of types[primaryType]) {
    const value = data[field.name] ?? ''
    const { encodedType, encodedValue } = encodeFieldValue(
      field.type,
      value,
      types,
    )

    encodedTypes.push(encodedType)
    encodedValues.push(encodedValue)
  }

  return encodeAbiParameters(
    parseAbiParameters(encodedTypes.join(',')),
    encodedValues,
  )
}

function hashStruct(
  primaryType: string,
  data: Record<string, any>,
  types: TypeDefinition,
): `0x${string}` {
  return keccak256(encodeData(primaryType, data, types))
}

/**
 * Used mainly for Ledger Nano S
 */

export const domainHash = (message: EIP712Message): `0x${string}` => {
  return hashStruct('EIP712Domain', message.domain, message.types)
}

export const messageHash = (message: EIP712Message): `0x${string}` => {
  return hashStruct(message.primaryType, message.message, message.types)
}
