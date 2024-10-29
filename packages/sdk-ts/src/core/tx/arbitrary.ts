import { sortObjectByKeys } from '../../utils/helpers'
import { toUtf8 } from '../../utils/utf8'

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
          data: Buffer.from(toUtf8(message)).toString('base64'),
          signer: signer,
        },
      },
    ],
    sequence: '0',
  }

  const stringified = toUtf8(JSON.stringify(sortObjectByKeys(signDoc)))

  return {
    signDoc,
    signDocBuff: Buffer.from(stringified),
    stringifiedSignDoc: stringified,
  }
}
