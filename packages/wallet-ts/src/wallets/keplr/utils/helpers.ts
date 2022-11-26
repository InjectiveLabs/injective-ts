import { ChainId } from '@injectivelabs/ts-types'
import { DEFAULT_STD_FEE } from '@injectivelabs/utils'
import { Msgs } from '@injectivelabs/sdk-ts'

export const createStdSignDoc = ({
  memo,
  chainId,
  accountNumber,
  sequence,
  gas,
  msgs,
}: {
  memo?: string
  chainId: ChainId
  accountNumber: number
  sequence: number
  gas?: string
  msgs: Msgs[]
}) => ({
  chain_id: chainId,
  account_number: accountNumber.toString(),
  sequence: sequence.toString(),
  fee: {
    ...DEFAULT_STD_FEE,
    gas: gas || DEFAULT_STD_FEE.gas,
  },
  msgs: msgs.map((m) => {
    const message = m.toDirectSign()

    return {
      value: Buffer.from(message.message.serializeBinary()).toString('base64'),
      type: message.type,
    }
  }),
  memo: memo || '',
})
