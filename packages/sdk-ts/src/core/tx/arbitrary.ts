import { sortObjectByKeys } from '../../utils/helpers.js'
import {
  toUtf8,
  uint8ArrayToBase64,
  stringToUint8Array,
} from '../../utils/encoding.js'

export const generateArbitrarySignDoc = (message: string, signer: string) => {
  const signDoc = {
    account_number: '0',
    chain_id: '',
    fee: {
      amount: [],
      gas: '0',
    },
    memo: '',
    msgs: [
      {
        type: 'sign/MsgSignData',
        value: {
          data: uint8ArrayToBase64(stringToUint8Array(toUtf8(message))),
          signer: signer,
        },
      },
    ],
    sequence: '0',
  }

  const stringified = toUtf8(JSON.stringify(sortObjectByKeys(signDoc)))

  return {
    signDoc,
    signDocBuff: stringToUint8Array(stringified),
    stringifiedSignDoc: stringified,
  }
}
