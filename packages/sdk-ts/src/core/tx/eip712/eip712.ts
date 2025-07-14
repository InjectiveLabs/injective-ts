import { Msgs } from '../../modules/msgs.js'
import { EvmChainId } from '@injectivelabs/ts-types'
import { Eip712ConvertFeeArgs, Eip712ConvertTxArgs } from './types.js'
import {
  getEip712Fee,
  getEipTxDetails,
  getEip712Domain,
  getEip712DomainV2,
  getDefaultEip712Types,
  getDefaultEip712TypesV2,
  getTypesIncludingFeePayer,
} from './utils.js'
import { getEipTxContext } from './utils.js'

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
  const eip712Msgs = messages.map((m) => m.toEip712())
  const eip712MessageTypes = messages[0].toEip712Types()

  const types = getDefaultEip712Types()
  const typesWithMessageTypes = {
    types: {
      ...types.types,
      ...Object.fromEntries(eip712MessageTypes),
    },
  }
  const typesWithFeePayer = getTypesIncludingFeePayer({
    fee,
    types: typesWithMessageTypes,
  })

  return {
    ...typesWithFeePayer,
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
      context: JSON.stringify(getEipTxContext({ ...tx, fee })),
      msgs: JSON.stringify(eip712Msgs),
    },
  }
}
