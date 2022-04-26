import { InjectiveAccountsRPCClient } from '@injectivelabs/exchange-api/injective_accounts_rpc_pb_service'
import {
  StreamSubaccountBalanceRequest,
  StreamSubaccountBalanceResponse,
} from '@injectivelabs/exchange-api/injective_accounts_rpc_pb'
import { StreamStatusResponse } from '../types'

export type BalanceStreamCallback = (
  response: StreamSubaccountBalanceResponse,
) => void

export class AccountStream {
  protected client: InjectiveAccountsRPCClient

  constructor(endpoint: string) {
    this.client = new InjectiveAccountsRPCClient(endpoint)
  }

  balances({
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
      callback(response)
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
