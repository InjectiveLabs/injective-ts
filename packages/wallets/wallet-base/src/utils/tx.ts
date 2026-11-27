import { getStdFee } from '@injectivelabs/utils'
import type { ChainId } from '@injectivelabs/ts-types'
import type { Msgs } from '@injectivelabs/sdk-ts/core/modules'

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
}) => {
  // root messages of the transaction, the chain cannot verify some of them signed with EIP712 v1
  msgs.forEach((m) => m.assertEip712V1Supported())

  return {
    chain_id: chainId,
    timeout_height: timeoutHeight || '',
    account_number: accountNumber.toString(),
    sequence: sequence.toString(),
    fee: getStdFee({ gas }),
    msgs: msgs.map((m) => m.toEip712()),
    memo: memo || '',
  }
}
