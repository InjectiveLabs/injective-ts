import { GeneralException } from '@injectivelabs/exceptions'
import { getEipTxContext } from './utils.js'
import { safeBigIntStringify } from '../../../utils/helpers.js'
import {
  getEip712Fee,
  getEipTxDetails,
  getEip712Domain,
  getEip712DomainV2,
  getDefaultEip712Types,
  getDefaultEip712TypesV2,
  getTypesIncludingFeeOptions,
} from './utils.js'
import type { EvmChainId } from '@injectivelabs/ts-types'
import type { Msgs } from '../../modules/msgs.js'
import type {
  TypedDataField,
  Eip712ConvertTxArgs,
  Eip712ConvertFeeArgs,
} from './types.js'

const mergeEip712TypeMaps = (maps: Map<string, TypedDataField[]>[]) => {
  const merged = new Map<string, TypedDataField[]>()

  for (const map of maps) {
    for (const [typeName, fields] of map) {
      const existing = merged.get(typeName)

      if (!existing) {
        merged.set(typeName, [...fields])
        continue
      }

      const known = new Map(existing.map((field) => [field.name, field.type]))
      const next = [...existing]

      for (const field of fields) {
        const previousType = known.get(field.name)

        if (previousType === undefined) {
          known.set(field.name, field.type)
          next.push(field)
          continue
        }

        if (previousType !== field.type) {
          throw new GeneralException(
            new Error(
              `EIP712 v1 field ${typeName}.${field.name} has conflicting types`,
            ),
          )
        }
      }

      merged.set(typeName, next)
    }
  }

  return merged
}

const coverMergedEip712Values = (
  msgs: { type: string; value: unknown }[],
  ownTypes: Map<string, TypedDataField[]>[],
  mergedTypes: Map<string, TypedDataField[]>,
) => {
  const mergedFields = mergedTypes.get('MsgValue') ?? []

  return msgs.map((msg, index) => {
    const ownFieldNames = new Set(
      (ownTypes[index]?.get('MsgValue') ?? []).map((field) => field.name),
    )
    const value = {
      ...(msg.value as Record<string, unknown>),
    }

    for (const field of mergedFields) {
      if (
        ownFieldNames.has(field.name) ||
        Object.prototype.hasOwnProperty.call(value, field.name)
      ) {
        continue
      }

      if (!field.type.endsWith('[]')) {
        throw new GeneralException(
          new Error(
            `EIP712 v1 message is missing ${field.name}, which is not an array`,
          ),
        )
      }

      value[field.name] = []
    }

    return {
      ...msg,
      value,
    }
  })
}

export const getEip712TypedData = ({
  msgs,
  tx,
  fee,
  evmChainId,
}: {
  msgs: Msgs | Msgs[]
  tx: Eip712ConvertTxArgs
  fee?: Eip712ConvertFeeArgs
  evmChainId: EvmChainId
}) => {
  const messages = Array.isArray(msgs) ? msgs : [msgs]
  const messageTypes = messages.map((m) => m.toEip712Types())
  const eip712MessageTypes = mergeEip712TypeMaps(messageTypes)
  const eip712Msgs = coverMergedEip712Values(
    messages.map((m) => m.toEip712()),
    messageTypes,
    eip712MessageTypes,
  )

  const types = getDefaultEip712Types()
  const typesWithMessageTypes = {
    types: {
      ...types.types,
      ...Object.fromEntries(eip712MessageTypes),
    },
  }
  const typesWithFeeOptions = getTypesIncludingFeeOptions({
    fee,
    types: typesWithMessageTypes,
  })

  return {
    ...typesWithFeeOptions,
    primaryType: 'Tx',
    ...getEip712Domain(evmChainId),
    message: {
      ...getEipTxDetails(tx),
      ...getEip712Fee(fee),
      msgs: eip712Msgs,
    },
  }
}

export const getEip712TypedDataV2 = ({
  msgs,
  tx,
  fee,
  evmChainId,
}: {
  msgs: Msgs | Msgs[]
  tx: Eip712ConvertTxArgs
  fee?: Eip712ConvertFeeArgs
  evmChainId: EvmChainId
}) => {
  const messages = Array.isArray(msgs) ? msgs : [msgs]
  const eip712Msgs = messages.map((m) => m.toEip712V2())
  const types = getDefaultEip712TypesV2()

  return {
    ...types,
    primaryType: 'Tx',
    ...getEip712DomainV2(evmChainId),
    message: {
      context: safeBigIntStringify(getEipTxContext({ ...tx, fee })),
      msgs: safeBigIntStringify(eip712Msgs),
    },
  }
}
