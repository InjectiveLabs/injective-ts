import { InjectiveAccountsRPCClient } from '@injectivelabs/exchange-api/injective_accounts_rpc_pb_service'
import {
  StreamSubaccountBalanceRequest,
  StreamSubaccountBalanceResponse,
} from '@injectivelabs/exchange-api/injective_accounts_rpc_pb'
import { StreamOperation } from '@injectivelabs/ts-types'
import { SubaccountTransformer } from '../../transformers/SubaccountTransformer'
import { SubaccountBalance } from '../../types'

export type SubaccountBalanceStreamCallback = ({
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

export class SubaccountBalanceStream {
  protected client: InjectiveAccountsRPCClient

  protected endpoint: string

  constructor(endpoint: string) {
    this.endpoint = endpoint
    this.client = new InjectiveAccountsRPCClient(endpoint)
  }

  start({
    subaccountId,
    callback,
  }: {
    subaccountId: string
    callback: SubaccountBalanceStreamCallback
  }) {
    const request = new StreamSubaccountBalanceRequest()
    request.setSubaccountId(subaccountId)

    const stream = this.client.streamSubaccountBalance(request)

    stream.on('data', (response: StreamSubaccountBalanceResponse) => {
      callback(transformer(response))
    })

    return stream
  }
}
