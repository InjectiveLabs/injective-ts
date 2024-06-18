import ensNameHash from '@ensdomains/eth-ens-namehash'
import { validate } from '@ensdomains/ens-validation'
import { ErrorType, GeneralException } from '@injectivelabs/exceptions'
import { keccak_256 as keccak256 } from 'js-sha3'

const nameHash = (inputName: string) => {
  let node = ''

  for (let i = 0; i < 32; i += 1) {
    node += '00'
  }

  if (inputName) {
    const labels = inputName.split('.')

    for (let i = labels.length - 1; i >= 0; i -= 1) {
      const normalizedLabel = ensNameHash.normalize(labels[i])
      const labelSha = keccak256(normalizedLabel)

      node = keccak256(Buffer.from(node + labelSha, 'hex'))
    }
  }

  return `0x${node}`
}

const nameToNode = (name: string) => {
  if (!name) {
    return []
  }

  const hash = nameHash(name)

  return Array.from(Buffer.from(hash.slice(2), 'hex'))
}

const validateNameLength = (label: string) => {
  if (typeof label !== 'string') {
    return 0
  }

  return !(label.length < 3 || label.length > 512)
}

const validateName = (name: string) => {
  if (!name) {
    return false
  }

  if (!validateNameLength(name)) {
    return false
  }

  const blackList =
    // eslint-disable-next-line no-control-regex,no-misleading-character-class
    /[\u0000-\u002c\u002e-\u002f\u003a-\u005e\u0060\u007b-\u007f\u200b\u200c\u200d\ufeff]/g

  if (blackList.test(name)) {
    return false
  }

  if (!validate(name)) {
    return false
  }

  return true
}

const normalizeName = (name: string) => {
  if (!name) {
    throw new GeneralException(new Error('Invalid Domain'), {
      context: 'Params',
      type: ErrorType.ValidationError,
    })
  }

  const labelArr = name.split('.')
  const emptyLabel = labelArr.find((i) => i.length < 1)

  if (emptyLabel !== undefined) {
    throw new GeneralException(new Error('Domain cannot have empty labels'), {
      context: 'Params',
      type: ErrorType.ValidationError,
    })
  }

  let normalizedArray: string[]

  try {
    normalizedArray = labelArr.map((e) => ensNameHash.normalize(e))
  } catch (e) {
    throw new GeneralException(new Error('Invalid Domain'), {
      context: 'Params',
      type: ErrorType.ValidationError,
    })
  }

  const normalizedDomain = normalizedArray.join('.')

  let label = normalizedDomain

  if (normalizedArray.length > 1) {
    label = normalizedArray.slice(0, normalizedArray.length - 1).join('.')
  }

  if (!validateName(label)) {
    throw new GeneralException(new Error('Invalid Domain'), {
      context: 'Params',
      type: ErrorType.ValidationError,
    })
  }

  return normalizedDomain
}

export { nameToNode, normalizeName }
