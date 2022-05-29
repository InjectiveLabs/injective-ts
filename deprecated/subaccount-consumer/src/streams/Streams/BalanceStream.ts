import { InjectiveAccountsRPCClient } from '@injectivelabs/exchange-api/injective_accounts_rpc_pb_service'
import {
  StreamSubaccountBalanceRequest,
  StreamSubaccountBalanceResponse,
} from '@injectivelabs/exchange-api/injective_accounts_rpc_pb'
import { StreamOperation } from '@injectivelabs/ts-types'
import { SubaccountTransformer } from '../../transformers/SubaccountTransformer'
import { SubaccountBalance, StreamStatusResponse } from '../../types'

export type BalanceStreamCallback = ({
  balance,
  operation,
  timestamp,
}: {
  balance: SubaccountBalance | undefined
  operation: StreamOperation
  timestamp: number
}) => void

const transformer = (response: StreamSubaccountBalanceResponse) => {
  const balance = response.getBalance()

  return {
    balance: balance
      ? SubaccountTransformer.grpcBalanceToBalance(balance)
      : undefined,
    operation: StreamOperation.Update,
    timestamp: response.getTimestamp(),
  }
}

export class BalanceStream {
  protected client: InjectiveAccountsRPCClient

  protected endpoint: string

  constructor(endpoint: string) {
    this.endpoint = endpoint
    this.client = new InjectiveAccountsRPCClient(endpoint)
  }

  start({
    subaccountId,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    subaccountId: string
    callback: BalanceStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }) {
    const request = new StreamSubaccountBalanceRequest()
    request.setSubaccountId(subaccountId)

    const stream = this.client.streamSubaccountBalance(request)

    stream.on('data', (response: StreamSubaccountBalanceResponse) => {
      callback(transformer(response))
    })

    if (onEndCallback) {
      stream.on('end', onEndCallback)
    }

    if (onStatusCallback) {
      stream.on('status', onStatusCallback)
    }

    return stream
  }
}
