import {
  keccak256,
  toBytes,
  encodeAbiParameters,
  parseAbiParameters,
} from 'viem'

// Helper to encode EIP-712 struct according to spec
function hashStruct(primaryType: string, data: any, types: any): `0x${string}` {
  return keccak256(encodeData(primaryType, data, types))
}

// Helper to encode type definition according to EIP-712
function encodeType(primaryType: string, types: any): string {
  // Get dependencies
  let deps = findTypeDependencies(primaryType, types)
  deps = deps.filter((t) => t !== primaryType)
  deps = [primaryType].concat(deps.sort())

  let result = ''
  for (const type of deps) {
    const fields = types[type]
    if (!fields) continue

    result += type + '('
    result += fields.map((f: any) => `${f.type} ${f.name}`).join(',')
    result += ')'
  }
  return result
}

// Helper to find type dependencies
function findTypeDependencies(
  primaryType: string,
  types: any,
  results: Set<string> = new Set(),
): string[] {
  if (results.has(primaryType) || !types[primaryType]) {
    return Array.from(results)
  }

  results.add(primaryType)

  for (const field of types[primaryType]) {
    const fieldType = field.type.replace(/\[\]$/, '') // Remove array suffix
    if (types[fieldType]) {
      findTypeDependencies(fieldType, types, results)
    }
  }

  return Array.from(results)
}

// Helper to encode data according to EIP-712
function encodeData(primaryType: string, data: any, types: any): `0x${string}` {
  const encodedTypes: string[] = ['bytes32']
  const encodedValues: any[] = [hashType(primaryType, types)]

  for (const field of types[primaryType]) {
    let value = data[field.name]
    if (value === undefined || value === null) {
      value = ''
    }

    const type = field.type

    if (type === 'string') {
      encodedTypes.push('bytes32')
      encodedValues.push(keccak256(toBytes(value)))
    } else if (type === 'bytes') {
      encodedTypes.push('bytes32')
      encodedValues.push(
        keccak256(typeof value === 'string' ? toBytes(value) : value),
      )
    } else if (types[type]) {
      // It's a struct type
      encodedTypes.push('bytes32')
      encodedValues.push(hashStruct(type, value, types))
    } else if (type.endsWith(']')) {
      // It's an array type
      throw new Error('Arrays not fully supported yet')
    } else {
      // It's a primitive type
      encodedTypes.push(type)
      encodedValues.push(value)
    }
  }

  return encodeAbiParameters(
    parseAbiParameters(encodedTypes.join(',')),
    encodedValues,
  )
}

// Helper to hash type definition
function hashType(primaryType: string, types: any): `0x${string}` {
  return keccak256(toBytes(encodeType(primaryType, types)))
}

export const domainHash = (message: any): `0x${string}` => {
  return hashStruct('EIP712Domain', message.domain, message.types)
}

export const messageHash = (message: any): `0x${string}` => {
  return hashStruct(message.primaryType, message.message, message.types)
}
