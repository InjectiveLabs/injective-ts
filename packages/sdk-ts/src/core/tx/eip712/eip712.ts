import { EthereumChainId } from '@injectivelabs/ts-types'
import { Msgs } from '../../modules/msgs'
import { Eip712ConvertFeeArgs, Eip712ConvertTxArgs } from './types'
import {
  getEip712Fee,
  getEipTxDetails,
  getEip712Domain,
  getEip712DomainV2,
  getDefaultEip712Types,
  getTypesIncludingFeePayer,
  getDefaultEip712TypesV2,
} from './utils'
import { getEipTxContext } from './utils'

export const getEip712TypedData = ({
  msgs,
  tx,
  fee,
  ethereumChainId,
}: {
  msgs: Msgs | Msgs[]
  tx: Eip712ConvertTxArgs
  fee?: Eip712ConvertFeeArgs
  ethereumChainId: EthereumChainId
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
    ...getEip712Domain(ethereumChainId),
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
  ethereumChainId,
}: {
  msgs: Msgs | Msgs[]
  tx: Eip712ConvertTxArgs
  fee?: Eip712ConvertFeeArgs
  ethereumChainId: EthereumChainId
}) => {
  const messages = Array.isArray(msgs) ? msgs : [msgs]
  const eip712Msgs = messages.map((m) => m.toWeb3())

  const types = getDefaultEip712TypesV2()

  return {
    ...types,
    primaryType: 'Tx',
    ...getEip712DomainV2(ethereumChainId),
    message: {
      context: JSON.stringify(getEipTxContext({ ...tx, fee })),
      msgs: JSON.stringify(eip712Msgs),
    },
  }
}
