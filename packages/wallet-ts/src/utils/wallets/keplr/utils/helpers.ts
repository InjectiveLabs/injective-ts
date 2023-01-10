import { ChainId } from '@injectivelabs/ts-types'
import { DEFAULT_STD_FEE } from '@injectivelabs/utils'
import { Msgs } from '@injectivelabs/sdk-ts'

export const createEip712StdSignDoc = ({
  memo,
  chainId,
  accountNumber,
  timeoutHeight,
  sequence,
  gas,
  msgs,
}: {
  memo?: string
  chainId: ChainId
  timeoutHeight?: string
  accountNumber: number
  sequence: number
  gas?: string
  msgs: Msgs[]
}) => ({
  chain_id: chainId,
  timeout_height: timeoutHeight || '',
  account_number: accountNumber.toString(),
  sequence: sequence.toString(),
  fee: {
    ...DEFAULT_STD_FEE,
    gas: gas || DEFAULT_STD_FEE.gas,
  },
  msgs: msgs.map((m) => m.toEip712()),
  memo: memo || '',
})
